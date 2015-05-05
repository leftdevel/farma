<?php

namespace Farma\InventoryBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\JsonResponse;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
 * @Route("/medicines")
 */
class MedicineController extends Controller
{
    /**
     * @Route("/", name="medicine_list", defaults={"_format" = "json"}, options={"expose" = true})
     * @Method({"GET"})
     */
    public function listAction()
    {
        $medicines = $this->get('inventory.api.medicine')->listAll();

        return new JsonResponse($medicines);
    }
}
