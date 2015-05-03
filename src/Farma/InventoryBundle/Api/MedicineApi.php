<?php

namespace Farma\InventoryBundle\Api;

use Farma\InventoryBundle\Entity\Medicine,
    Farma\InventoryBundle\Repository\MedicineRepository;

class MedicineApi
{
    private $repository;

    public function __construct(MedicineRepository $repository)
    {
        $this->repository = $repository;
    }

    public function listAll()
    {
        return $this->repository->listAll();
    }
}