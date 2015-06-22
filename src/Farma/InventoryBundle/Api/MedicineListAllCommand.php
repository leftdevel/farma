<?php

namespace Farma\InventoryBundle\Api;

use Farma\BaseBundle\CommandInterface,
    Farma\InventoryBundle\Repository\MedicineRepository;

class MedicineListAllCommand implements CommandInterface
{
    private $repository;

    public function __construct(MedicineRepository $repository)
    {
        $this->repository = $repository;
    }

    public function execute()
    {
        return $medicines = $this->repository->listAll();
    }
}
