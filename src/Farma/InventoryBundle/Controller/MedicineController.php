<?php

namespace Farma\InventoryBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller,
    Symfony\Component\HttpFoundation\JsonResponse,
    Symfony\Component\HttpFoundation\Response,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route,
    Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

use Farma\InventoryBundle\Entity\MedicineException,
    Farma\InventoryBundle\Api\MedicineApiException;

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

    /**
     * @Route("/", name="medicine_create", defaults={"_format" = "json"}, options={"expose" = true})
     * @Method({"POST"})
     */
    public function createAction(Request $request)
    {
        $input = @json_decode($request->getContent(), true);

        if (!$input) {
            throw new BadRequestHttpException('Invalid input');
        }

        try {
            $user = $this->get('security.context')->getToken()->getUser();
            $this->get('inventory.api.medicine')->create($user, $input);

            return new JsonResponse(array('success' => true), Response::HTTP_CREATED);

         } catch (MedicineApiException $e) {
             throw new BadRequestHttpException('invalid input');
         } catch (MedicineException $e) {
             throw new BadRequestHttpException('invalid input');
         }
    }
}
