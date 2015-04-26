<?php

namespace Farma\UserBundle\Repository;

use Doctrine\ORM\EntityRepository;

class UserRepository extends EntityRepository
{
    public function save($object)
    {
        $this->getEntityManager()->persist($object);
        $this->getEntityManager()->flush();
    }

    public function findWithColumns(array $columns)
    {
        $query = "SELECT ".implode(', ', $columns)." FROM member ORDER BY id ASC";
        $conn = $this->getEntityManager()->getConnection();
        return $conn->fetchAll($query);
    }

    public function findOneIdByEmail($email)
    {
        $query = "SELECT id FROM member WHERE email = ? LIMIT 1";
        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($query);
        $stmt->bindValue(1, $email);
        $stmt->execute();

        return $stmt->fetchColumn();
    }
}
