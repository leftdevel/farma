<?php

namespace Farma\InventoryBundle\Api;

use Symfony\Component\Security\Core\User\UserInterface,
    Symfony\Component\Validator\Validator\LegacyValidator;

use Farma\InventoryBundle\Repository\MedicineRepository;

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
        $command = new MedicineListAllCommand($this->repository);
        return $command->execute();
    }

    public function create(UserInterface $user, array $input)
    {
        $command = new MedicineCreateCommand($this->repository, $this->validator, $user, $input);
        $command->execute();
    }
}
