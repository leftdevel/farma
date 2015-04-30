<?php

namespace Farma\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\JsonResponse;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * @Route("/app")
 */
class AppController extends Controller
{
    /**
     * @Route("/", name="app_index")
     * @Template()
     */
    public function indexAction()
    {
        return array();
    }

    /**
     * @Route("/settings", name="app_settings", defaults={"_format" = "json"})
     */
    public function settingsAction()
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $env = $this->get('kernel')->getEnvironment();
        $settings = array(
            'env' => $env,
            'user' =>  $user->toArray()
        );

        return new JsonResponse($settings);
    }
}
