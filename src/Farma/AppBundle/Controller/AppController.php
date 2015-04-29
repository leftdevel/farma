<?php

namespace Farma\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

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
        // @TODO return right role
        return array('role' => 'ROLE_ADMIN');
    }
}
