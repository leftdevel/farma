<?php

namespace Farma\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

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
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $password;

    /**
     * @ORM\Column(name="full_name", type="string", length=100)
     */
    private $fullName;

    /**
     * @ORM\Column(name="is_active", type="boolean")
     */
    private $isActive;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $roles;

    /**
     * @ORM\Column(type="integer")
     */
    private $created;

    public function __construct()
    {
        $this->isActive = true;
        $createdDateTime = new \DateTime('now');
        $this->created = $createdDateTime->getTimestamp();
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
        $this->roles = implode(',', $roles);
    }

    public function getRoles()
    {
        $default = array('ROLE_USER');
        $roles = explode(',', $this->roles);

        return array_merge($default, $roles);
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
}