<?php

namespace Farma\InventoryBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Security\Core\User\UserInterface,
    Symfony\Component\Validator\Constraints as Assert;

use Farma\BaseBundle\Util\TimestampValidator,
    Farma\InventoryBundle\Model\Product\BatchInterface;

/**
 * @ORM\Entity()
 * @ORM\Table(name="medicine_batch")
 */
class MedicineBatch implements BatchInterface
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank()
     * @Assert\Type(type="integer")
     * @Assert\GreaterThan(value=0)
     */
    private $quantity;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\Type(type="integer")
     * @Assert\GreaterThanOrEqual(value=0)
     */
    private $cost;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\NotBlank()
     * @Assert\Type(type="integer")
     */
    private $expiry;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank()
     * @Assert\Type(type="integer")
     */
    private $created;

    /**
     * @ORM\ManyToOne(targetEntity="Medicine")
     * @Assert\NotBlank()
     */
    private $medicine;

    /**
     * @ORM\ManyToOne(targetEntity="Farma\UserBundle\Entity\User")
     * @Assert\NotBlank()
     */
    private $user;

    public function __construct()
    {
        $this->created = time();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;
    }

    public function getQuantity()
    {
        return $this->quantity;
    }

    public function setCost($cost)
    {
        $this->cost = $cost;
    }

    public function getCost()
    {
        return $this->cost;
    }

    public function setExpiry($expiry)
    {
        if ($expiry !== null && !TimestampValidator::isValid($expiry)) {
            throw new MedicineException('expiry date is invalid');
        }

        $this->expiry = $expiry;
    }

    public function getExpiry()
    {
        return $this->expiry;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function setMedicine(Medicine $medicine)
    {
        $this->medicine = $medicine;
    }

    public function getMedicine()
    {
        return $this->medicine;
    }

    public function setUser(UserInterface $user)
    {
        $this->user = $user;
    }

    public function getUser()
    {
        return $this->user;
    }
}
