<?php

namespace Farma\UserBundle\Repository;

use Doctrine\ORM\EntityRepository;

class UserRepository extends EntityRepository
{
    public function save($object)
    {
        $this->getEntityManager()->persist($object);
        $this->getEntityManager()->flush();

        return $object;
    }

    public function findWithColumns(array $columns)
    {
        $query = "SELECT ".implode(', ', $columns)." FROM member";
        $conn = $this->getEntityManager()->getConnection();
        return $conn->fetchAll($query);
    }
}
