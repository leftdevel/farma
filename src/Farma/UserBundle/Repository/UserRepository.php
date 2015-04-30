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

    public function findWithColumns(array $columns, array $filters = array())
    {
        $selectQuery = "SELECT ".implode(', ', $columns)." FROM member ";
        $fromQuery = count($filters) > 0 ? $this->getFromQueryForFilters($filters) : '';
        $orderByQuery = " ORDER BY id ASC";

        $query = $selectQuery.$fromQuery.$orderByQuery;

        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($query);

        $nextBindValue = 0;
        foreach ($filters as $filter => $value) {
            $nextBindValue++;
            $stmt->bindValue($nextBindValue, $value);
        }

        $stmt->execute();

        return $stmt->fetchAll();
    }

    private function getFromQueryForFilters(array $filters)
    {
        if (count($filters) === 0) {
            throw new \Exception('Filters are required');
        }

        $elements = array();

        foreach ($filters as $filter => $value) {
            $elements[] = $filter.' = ?';
        }

        $query = implode(' AND ' , $elements);

        return " WHERE ".$query;
    }

    public function findOneByIdWithColumns($id, array $columns)
    {
        $query = "SELECT ".implode(', ', $columns)." FROM member WHERE id = ? LIMIT 1";
        $conn = $this->getEntityManager()->getConnection();
        $stmt = $conn->prepare($query);
        $stmt->bindValue(1, intval($id));
        $stmt->execute();

        return $stmt->fetch();
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

    public function delete($object)
    {
        $this->getEntityManager()->remove($object);
        $this->getEntityManager()->flush();
    }
}
