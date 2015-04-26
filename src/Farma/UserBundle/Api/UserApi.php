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

        if (in_array(UserRole::SUPER_ADMIN, $user->getRoles())) {
            throw new UserApiException('Cannot create SUPER_ADMIN');
        }

        if ($this->repository->findOneIdByEmail($user->getEmail()) !== false) {
            throw new UserApiException('Email is already in use');
        }

        $this->repository->save($user);
    }

    public function update(UserInterface $user, array $input)
    {
        $isSuperAdmin = in_array(UserRole::SUPER_ADMIN, $user->getRoles());

        if (!$user->getId()) {
            throw new UserApiException('User must exist');
        }

        $this->bindAndValidateUser($user, $input);
        $id = $this->repository->findOneIdByEmail($user->getEmail());

        if ($id && (intval($id) !== $user->getId())) {
            throw new UserApiException('Email is already in use');
        }

        if ($isSuperAdmin && !in_array(UserRole::SUPER_ADMIN, $user->getRoles())) {
            throw new UserApiException('Cannot downgrade from SUPER_ADMIN');
        }

        if (!$isSuperAdmin && in_array(UserRole::SUPER_ADMIN, $user->getRoles())) {
            throw new UserApiException('Cannot promote to SUPER_ADMIN');
        }

        $this->repository->save($user);
    }

    private function bindAndValidateUser(UserInterface $user, array $input)
    {
        $allowedColumns = array('full_name', 'email', 'flat_roles');

        if (count(array_diff($allowedColumns, array_keys($input))) !== 0) {
            throw new UserApiException('Missing properties');
        }

        $user->setFullName(trim($input['full_name']));
        $user->setEmail(trim($input['email']));
        $user->setFlatRoles(trim($input['flat_roles']));

        if (isset($input['password'])) {
            $rawPassword = trim($input['password']);

            if (strlen($rawPassword) < 3) {
                throw new UserApiException('Invalid Password');
            }

            $encodedPassword = $this->passwordEncoder->encodePassword($user, $rawPassword);
            $user->setPassword($encodedPassword);
        }

        $errors = $this->validator->validate($user);

        if (count($errors) > 0) {
            throw new UserApiException('Invalid input');
        }
    }
}