<?php

namespace Farma\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert,
    Symfony\Component\Validator\Context\ExecutionContextInterface,
    Symfony\Component\Security\Core\User\UserInterface;

use Farma\UserBundle\Model\UserRole;

/**
 * @ORM\Entity(repositoryClass="Farma\UserBundle\Repository\UserRepository")
 * @ORM\Table(name="member")
 */
class User implements UserInterface, \Serializable
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $password;

    /**
     * @ORM\Column(name="full_name", type="string", length=100)
     * @Assert\NotBlank()
     */
    private $fullName;

    /**
     * @ORM\Column(name="is_active", type="boolean")
     */
    private $isActive;

    /**
     * @ORM\Column(name="flat_roles", type="string", length=255)
     * @Assert\NotBlank()
     */
    private $flatRoles;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank()
     */
    private $created;

    public function __construct()
    {
        $this->isActive = true;
        $createdDateTime = new \DateTime('now');
        $this->created = $createdDateTime->getTimestamp();
        $this->addRole(UserRole::USER);
    }

    public function getId()
    {
        return $this->id;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function setFullName($fullName)
    {
        $this->fullName = $fullName;
    }

    public function getFullName()
    {
        return $this->fullName;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function setFlatRoles($flatRoles)
    {
        $this->flatRoles = $flatRoles;
    }

    public function getFlatRoles()
    {
        return $this->flatRoles;
    }

    // USER INTERFACE

    public function getUsername()
    {
        return $this->email;
    }

    public function getSalt()
    {
        return $this->getCreated();
    }

    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;
    }

    public function getIsActive()
    {
        return $this->isActive;
    }

    public function setRoles(array $roles)
    {
        foreach ($roles as $role) {
            if (!in_array($role, UserRole::getRoles())) {
                throw new \Exception('Invalid role: '.$role);
            }
        }

        $this->flatRoles = implode(',', array_unique($roles));
    }

    public function getRoles()
    {
        return !$this->flatRoles ? array() : explode(',', $this->flatRoles);
    }

    public function addRole($role)
    {
        $roles = $this->getRoles();
        $roles[] = $role;
        $this->setRoles($roles);
    }

    public function eraseCredentials()
    {
    }

    // SERIALIZABLE

    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->email,
            $this->password
        ));
    }

    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->email,
            $this->password
        ) = unserialize($serialized);
    }

    // VALIDATION

    /**
     * @Assert\Callback
     */
    public function validateRoles(ExecutionContextInterface $context)
    {
        if (count(array_diff($this->getRoles(), UserRole::getRoles())) > 0) {
            $context->buildViolation('Invalid Roles')
                ->atPath('flatRoles')
                ->addViolation()
            ;
        }
    }
}