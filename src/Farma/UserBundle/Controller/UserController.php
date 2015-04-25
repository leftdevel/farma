<?php

namespace Farma\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\JsonResponse;

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
        $userApiManager = $this->get('user.api');

        return new JsonResponse($userApiManager->listAll());
    }
}
