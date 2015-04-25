<?php

namespace Farma\UserBundle\Api;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface,
    Symfony\Component\Security\Core\User\UserInterface,
    Symfony\Component\Validator\Validator\LegacyValidator;

use Farma\UserBundle\Api\UserApiException,
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
        $user = new User();
        $this->bindAndValidateUser($user, $input);

        if ($this->repository->findOneByEmail($user->getEmail()) !== null) {
            throw new UserApiException('Email already exists');
        }

        $this->repository->save($user);
    }

    private function bindAndValidateUser(UserInterface $user, array $input)
    {
        $allowedColumns = array('full_name', 'email', 'flat_roles');

        if (count(array_diff($allowedColumns, array_keys($input))) !== 0) {
            throw new UserApiException('Missing properties');
        }

        $user->setFullName($input['full_name']);
        $user->setEmail($input['email']);
        $user->setFlatRoles($input['flat_roles']);

        if (isset($input['password'])) {
            $rawPassword = $input['password'];
            $encodedPassword = $this->passwordEncoder->encodePassword($user, $rawPassword);
            $user->setPassword($encodedPassword);
        }

        $errors = $this->validator->validate($user);

        if (count($errors) > 0 || in_array(UserRole::SUPER_ADMIN, $user->getRoles())) {
            throw new UserApiException('Invalid input');
        }
    }
}