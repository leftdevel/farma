<?php

namespace Farma\InventoryBundle\Api;

use Symfony\Component\Security\Core\User\UserInterface,
    Symfony\Component\Validator\Validator\LegacyValidator;

use Farma\BaseBundle\CommandInterface,
    Farma\InventoryBundle\Entity\Medicine,
    Farma\InventoryBundle\Entity\MedicineBatch,
    Farma\InventoryBundle\Repository\MedicineRepository;

class MedicineCreateCommand implements CommandInterface
{
    private $repository;
    private $validator;
    private $user;
    private $input;
    private $medicine;
    private $batch;

    public function __construct(MedicineRepository $repository, LegacyValidator $validator, UserInterface $user, array $input)
    {
        $this->repository = $repository;
        $this->validator = $validator;
        $this->user = $user;
        $this->input = $input;
    }

    public function execute()
    {
        $this->createMedicine();
        $this->createBatch();
        $this->denormalizeBatchIntoMedicine();
        $this->persist();
    }

    private function createMedicine()
    {
        $this->validateMedicineInput();

        $this->medicine = new Medicine();
        $this->medicine->setName($this->input['name']);
        $this->medicine->setGeneric($this->input['generic']);
        $this->medicine->setLaboratory($this->input['laboratory']);
        $this->medicine->setPresentation($this->input['presentation']);
        $this->medicine->setConcentration($this->input['concentration']);
        $this->medicine->setPrice(intval($this->input['price']));
    }

    private function validateMedicineInput()
    {
        $allowedColumns = array('name', 'generic', 'laboratory', 'presentation', 'concentration', 'price');

        if (count(array_diff($allowedColumns, array_keys($this->input))) > 0) {
            throw new MedicineApiException('Missing medicine properties');
        }
    }

    private function createBatch()
    {
        $this->validateBatchInput();

        $this->batch = new MedicineBatch();
        $this->batch->setQuantity(intval($this->input['quantity']));
        $this->batch->setCost(intval($this->input['cost']));
        $this->batch->setExpiry(intval($this->input['expiry']));
        $this->batch->setUser($this->user);
        $this->batch->setMedicine($this->medicine);
    }

    private function validateBatchInput()
    {
        $allowedColumns = array('quantity', 'cost', 'expiry');

        if (count(array_diff($allowedColumns, array_keys($this->input))) > 0) {
            throw new MedicineApiException('Missing batch properties');
        }
    }

    private function denormalizeBatchIntoMedicine()
    {
        $this->medicine->setExpiryFirst($this->batch->getExpiry());
        $this->medicine->setExpiryLast($this->batch->getExpiry());
        $this->medicine->setCost($this->batch->getCost());
        $this->medicine->addQuantity($this->batch->getQuantity());
    }

    private function persist()
    {
        $this->validateBatch();
        $this->validateMedicine();
        $this->repository->saveNewMedicine($this->medicine, $this->batch);
    }

    private function validateBatch()
    {
        $errors = $this->validator->validate($this->batch);
        if (count($errors) > 0) {
            throw new MedicineApiException('Invalid batch input');
        }
    }

    private function validateMedicine()
    {
        $errors = $this->validator->validate($this->medicine);
        if (count($errors) > 0) {
            throw new MedicineApiException('Invalid medicine input');
        }
    }
}
