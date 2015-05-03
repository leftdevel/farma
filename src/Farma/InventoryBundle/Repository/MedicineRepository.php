<?php

namespace Farma\InventoryBundle\Repository;

use Doctrine\ORM\EntityRepository;

class MedicineRepository extends EntityRepository
{
    public function save($object)
    {
        $this->getEntityManager()->persist($object);
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
            FROM medicine ORDER BY name_normalized ASC";

        return $conn->fetchAll($query);
    }

    public function delete($object)
    {
        $this->getEntityManager()->remove($object);
        $this->getEntityManager()->flush();
    }
}
