<?php

namespace Farma\UserBundle\Api;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface,
    Symfony\Component\Validator\Validator\LegacyValidator;

use Farma\UserBundle\Api\CreateUserException,
    Farma\UserBundle\Entity\User,
    Farma\UserBundle\Model\UserRole,
    Farma\UserBundle\Repository\UserRepository;

class UserApi
{
    private $repository;
    private $passwordEncoder;
    private $validator;

    public function __construct(
        UserRepository $repository,
        UserPasswordEncoderInterface $passwordEncoder,
        LegacyValidator $validator
    ){
        $this->repository = $repository;
        $this->passwordEncoder = $passwordEncoder;
        $this->validator = $validator;
    }

    public function listAll()
    {
        $columns = array('id', 'full_name', 'email', 'flat_roles', 'created');
        return $this->repository->findWithColumns($columns);
    }

    public function create(array $input)
    {
        $allowedColumns = array('full_name', 'email', 'password', 'flat_roles');

        if (count(array_diff($allowedColumns, array_keys($input))) !== 0) {
            throw new CreateUserException('Missing properties');
        }

        $user = new User();
        $user->setFullName($input['full_name']);
        $user->setEmail($input['email']);
        $user->setFlatRoles($input['flat_roles']);

        $rawPassword = $input['password'];
        $encodedPassword = $this->passwordEncoder->encodePassword($user, $rawPassword);
        $user->setPassword($encodedPassword);

        $errors = $this->validator->validate($user);

        if (count($errors) > 0 || in_array(UserRole::SUPER_ADMIN, $user->getRoles())) {
            throw new CreateUserException('Invalid input');
        }

        if ($this->repository->findOneByEmail($user->getEmail()) !== null) {
            throw new CreateUserException('Email already exists');
        }

        $this->repository->save($user);
    }
}