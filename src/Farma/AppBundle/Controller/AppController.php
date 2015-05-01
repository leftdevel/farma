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
        return array('settings' => $this->getSettings());
    }

    /**
     * @Route("/settings", name="app_settings", defaults={"_format" = "json"}, options={"expose" = true})
     */
    public function settingsAction()
    {
        return new JsonResponse($this->getSettings());
    }

    private function getSettings()
    {
        $user = $this->get('security.context')->getToken()->getUser();
        $env = $this->get('kernel')->getEnvironment();

        return array(
            'env' => $env,
            'logout_url' => $this->generateUrl('_base_logout'),
            'user' =>  $user->toArray()
        );
    }
}
