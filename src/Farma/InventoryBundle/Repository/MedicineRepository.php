<?php

namespace Farma\InventoryBundle\Repository;

use Doctrine\ORM\EntityRepository;

use Farma\InventoryBundle\Entity\Medicine,
    Farma\InventoryBundle\Entity\MedicineBatch;

class MedicineRepository extends EntityRepository
{
    public function saveNewMedicine(Medicine $medicine, MedicineBatch $batch)
    {
        $this->getEntityManager()->persist($medicine);
        $this->getEntityManager()->persist($batch);
        $this->getEntityManager()->flush();
    }

    public function listAll()
    {
        $conn = $this->getEntityManager()->getConnection();
        $query = "SELECT id, name, name_normalized,
            generic, generic_normalized, presentation,
            presentation_normalized, laboratory,
            laboratory_normalized, concentration,
            concentration_normalized, cost, price, quantity,
            expiry_first, expiry_last, updated
            FROM medicine
            WHERE is_disabled != 1
            ORDER BY name_normalized ASC";

        return $conn->fetchAll($query);
    }

    public function findBatchesByMedicineId($medicineId)
    {
        $query = "SELECT id, medicine_id, quantity, cost, expiry FROM medicine_batch WHERE medicine_id = ? ORDER BY CREATED DESC";
        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($query);
        $stmt->bindValue(1, intval($medicineId));
        $stmt->execute();

        return $stmt->fetchAll();
    }
}
