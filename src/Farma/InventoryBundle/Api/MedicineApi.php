<?php

namespace Farma\InventoryBundle\Api;

use Symfony\Component\Security\Core\User\UserInterface,
    Symfony\Component\Validator\Validator\LegacyValidator;

use Farma\InventoryBundle\Entity\Medicine,
    Farma\InventoryBundle\Entity\MedicineBatch,
    Farma\InventoryBundle\Repository\MedicineRepository;

class MedicineApi
{
    private $repository;
    private $validator;

    public function __construct(MedicineRepository $repository, LegacyValidator $validator)
    {
        $this->repository = $repository;
        $this->validator = $validator;
    }

    public function listAll()
    {
        return $this->repository->listAll();
    }

    public function create(array $input, UserInterface $user)
    {
        $medicine = $this->createMedicine($input);
        $batch = $this->createBatch($input, $user, $medicine);

        // Denormalized
        $medicine->setExpiryFirst($batch->getExpiry());
        $medicine->setExpiryLast($batch->getExpiry());
        $medicine->setCost($batch->getCost());
        $medicine->addQuantity($batch->getQuantity());

        // validation before persist

        $errors = $this->validator->validate($batch);
        print_r($errors);
        if (count($errors) > 0) {
            throw new MedicineApiException('Invalid batch input');
        }

        $errors = $this->validator->validate($medicine);
        if (count($errors) > 0) {
            throw new MedicineApiException('Invalid medicine input');
        }

        // persist finally
        $this->repository->saveNewMedicine($medicine, $batch);
    }

    private function createMedicine(array $input)
    {
        $allowedColumns = array('name', 'generic', 'laboratory', 'presentation', 'concentration', 'price');

        if (count(array_diff($allowedColumns, array_keys($input))) > 0) {
            throw new MedicineApiException('Missing medicine properties');
        }

        $medicine = new Medicine();
        $medicine->setName($input['name']);
        $medicine->setGeneric($input['generic']);
        $medicine->setLaboratory($input['laboratory']);
        $medicine->setPresentation($input['presentation']);
        $medicine->setConcentration($input['concentration']);
        $medicine->setPrice(intval($input['price']));

        return $medicine;
    }

    private function createBatch(array $input, UserInterface $user, Medicine $medicine)
    {
        $allowedColumns = array('quantity', 'cost', 'expiry');

        if (count(array_diff($allowedColumns, array_keys($input))) > 0) {
            throw new MedicineApiException('Missing batch properties');
        }

        $batch = new MedicineBatch();
        $batch->setQuantity(intval($input['quantity']));
        $batch->setCost(intval($input['cost']));
        $batch->setExpiry(intval($input['expiry']));
        $batch->setUser($user);
        $batch->setMedicine($medicine);

        return $batch;
    }
}