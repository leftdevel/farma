<?php

namespace Farma\InventoryBundle\Api;

use Farma\BaseBundle\CommandInterface,
    Farma\InventoryBundle\Repository\MedicineRepository;

class MedicineListAllCommand implements CommandInterface
{
    private $repository;
    private $numericColumns;

    public function __construct(MedicineRepository $repository, array $numericColumns)
    {
        $this->repository = $repository;
        $this->numericColumns = $numericColumns;
    }

    public function execute()
    {
        $medicines = $this->repository->listAll();
        $normalizedMedicines = array();

        foreach($medicines as $medicine) {
            $normalizedMedicines[] = $this->castNumericColumns($medicine);
        }

        return $normalizedMedicines;
    }

    private function castNumericColumns(array $medicine) {
        foreach ($this->numericColumns as $column) {
            if (isset($medicine[$column])) {
                $medicine[$column] = intval($medicine[$column]);
            }
        }

        return $medicine;
    }
}
