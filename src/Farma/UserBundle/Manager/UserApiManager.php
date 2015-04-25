<?php

namespace Farma\UserBundle\Manager;

use Farma\UserBundle\Repository\UserRepository;

class UserApiManager
{
    private $repository;

    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    public function listAll()
    {
        $columns = array('id', 'full_name', 'email', 'roles', 'created');
        return $this->repository->findWithColumns($columns);
    }
}