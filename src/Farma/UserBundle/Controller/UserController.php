<?php

namespace Farma\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpKernel\Exception\BadRequestHttpException,
    Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use Farma\UserBundle\Entity\User,
    Farma\UserBundle\Entity\UserException,
    Farma\UserBundle\Model\UserRole,
    Farma\UserBundle\Api\UserApiException;

/**
 * @Route("/users")
 */
class UserController extends Controller
{
    /**
     * @Route("/", name="user_list", defaults={"_format" = "json"}, options={"expose" = true})
     * @Method({"GET"})
     */
    public function listAction(Request $request)
    {
        $filters = $request->query->all();
        return new JsonResponse($this->get('user.api')->listAll($filters));
    }

    /**
     * @Route("/", name="user_create", defaults={"_format" = "json"}, options={"expose" = true})
     * @Method({"POST"})
     */
    public function createAction(Request $request)
    {
        $input = @json_decode($request->getContent(), true);

        if (!$input) {
            throw new BadRequestHttpException();
        }

        try {
            $this->get('user.api')->create($input);
            return new JsonResponse(array('success' => true), Response::HTTP_CREATED);

        } catch (UserException $e) {
            throw new BadRequestHttpException();

        } catch (UserApiException $e) {
            throw new BadRequestHttpException();
        }
    }

    /**
     * @Route("/{id}", name="user_update", defaults={"_format" = "json"}, options={"expose" = true})
     * @Method({"PUT"})
     * @ParamConverter("user", class="FarmaUserBundle:User")
     */
    public function updateAction(User $user, Request $request)
    {
        $security = $this->get('security.context');
        if ($user->isSuperAdmin() && !$security->isGranted(array(UserRole::SUPER_ADMIN))) {
            throw new AccessDeniedHttpException();
        }

        $input = @json_decode($request->getContent(), true);

        if (!$input) {
            throw new BadRequestHttpException();
        }

        try {
            $this->get('user.api')->update($user, $input);
            return new JsonResponse(array('success' => true));

        } catch (UserException $e) {
            throw new BadRequestHttpException();

        } catch (UserApiException $e) {
            throw new BadRequestHttpException();
        }
    }

    /**
     * @Route("/{id}", name="user_delete", defaults={"_format" = "json"}, options={"expose" = true})
     * @Method({"DELETE"})
     * @ParamConverter("user", class="FarmaUserBundle:User")
     */
    public function deleteUserAction(User $user)
    {
        if ($user->isSuperAdmin()) {
            throw new AccessDeniedHttpException();
        }

        if ($this->get('security.context')->getToken()->getUser()->getId() === $user->getId()) {
            throw new BadRequestHttpException();
        }

        try {
            $this->get('user.api')->delete($user);
            return new JsonResponse(array('success' => true));

        } catch (UserApiException $e) {
            throw new BadRequestHttpException();
        }
    }
}
