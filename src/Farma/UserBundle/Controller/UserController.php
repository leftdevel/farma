<?php

namespace Farma\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

/**
 * @Route("/users")
 * @Security("has_role('ROLE_ADMIN')")
 */
class UserController extends Controller
{
    /**
     * @Route("/", name="user_list", defaults={"_format" = "json"})
     * @Method({"GET"})
     */
    public function listAction()
    {
        $userApi = $this->get('user.api');

        return new JsonResponse($userApi->listAll());
    }

    /**
     * @Route("/", name="user_create", defaults={"_format" = "json"})
     * @Method({"POST"})
     */
    public function createAction(Request $request)
    {
        $userApi = $this->get('user.api');
        $input = @json_decode($request->getContent(), true);

        if (!$input) {
            throw new BadRequestHttpException();
        }

        try {
            $userApi->create($input);
            return new JsonResponse(array('success' => true), 201);

        } catch (\Exception $e) {
            throw new BadRequestHttpException();
        }
    }
}
