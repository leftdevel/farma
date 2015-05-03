<?php

namespace Farma\InventoryBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

use Farma\BaseBundle\Util\StringUtil,
    Farma\BaseBundle\Util\TimestampValidator,
    Farma\InventoryBundle\Model\Product\ProductInterface,
    Farma\InventoryBundle\Model\Product\OutOfStockException;

/**
 * @ORM\Entity(repositoryClass="Farma\InventoryBundle\Repository\MedicineRepository")
 * @ORM\Table(name="medicine")
 */
class Medicine implements ProductInterface
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
     */
    private $created;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank()
     */
    private $updated;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, name="name_normalized")
     * @Assert\NotBlank()
     */
    private $nameNormalized;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $generic;

    /**
     * @ORM\Column(type="string", length=255, name="generic_normalized")
     * @Assert\NotBlank()
     */
    private $genericNormalized;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $laboratory;

    /**
     * @ORM\Column(type="string", length=255, name="laboratory_normalized", nullable=true)
     */
    private $laboratoryNormalized;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $presentation;

    /**
     * @ORM\Column(type="string", length=255, name="presentation_normalized")
     * @Assert\NotBlank()
     */
    private $presentationNormalized;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $concentration;

    /**
     * @ORM\Column(type="string", length=255, name="concentration_normalized", nullable=true)
     */
    private $concentrationNormalized;

    /**
     * @ORM\Column(type="integer", name="expiry_first", nullable=true)
     */
    private $expiryFirst;

    /**
     * @ORM\Column(type="integer", name="expiry_last", nullable=true)
     */
    private $expiryLast;

    /**
     * @ORM\Column(type="decimal", scale=10, precision=2, nullable=true)
     */
    private $cost;

    /**
     * @ORM\Column(type="decimal", scale=10, precision=2)
     * @Assert\NotBlank()
     */
    private $price;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank()
     */
    private $quantity;

    public function __construct()
    {
        $time = time();
        $this->created = $time;
        $this->updated = $time;
        $this->quantity = 0;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function setUpdated()
    {
        return $this->updated;
    }

    public function setName($name)
    {
        $name = StringUtil::compact($name);
        $this->name = $name;
        $this->nameNormalized = StringUtil::createIndexable($name);
    }

    public function getName()
    {
        return $this->name;
    }

    public function getNameNormalized()
    {
        return $this->nameNormalized;
    }

    public function setGeneric($generic)
    {
        $generic = StringUtil::compact($generic);
        $this->generic = $generic;
        $this->genericNormalized = StringUtil::createIndexable($generic);
    }

    public function getGeneric()
    {
        return $this->generic;
    }

    public function getGenericNormalized()
    {
        return $this->genericNormalized;
    }

    public function setLaboratory($laboratory)
    {
        $laboratory = StringUtil::compact($laboratory);
        $this->laboratory = $laboratory;
        $this->laboratoryNormalized = StringUtil::createIndexable($laboratory);
    }

    public function getLaboratory()
    {
        return $this->laboratory;
    }

    public function getLaboratoryNormalized()
    {
        return $this->laboratoryNormalized;
    }

    public function setPresentation($presentation)
    {
        $presentation = StringUtil::compact($presentation);
        $this->presentation = $presentation;
        $this->presentationNormalized = StringUtil::createIndexable($presentation);
    }

    public function getPresentation()
    {
        return $this->presentation;
    }

    public function getPresentationNormalized()
    {
        return $this->presentationNormalized;
    }

    public function setConcentration($concentration)
    {
        $concentration = StringUtil::compact($concentration);
        $this->concentration = $concentration;
        $this->concentrationNormalized = StringUtil::createIndexable($concentration);
    }

    public function getConcentration()
    {
        return $this->concentration;
    }

    public function getConcentrationNormalized()
    {
        return $this->concentrationNormalized;
    }

    public function setExpiryFirst($expiryFirst)
    {
        if (!TimestampValidator::isValid($expiryFirst)) {
            throw new MedicineException('Invalid expiry timestamp: '.$expiryFirst);
        }

        $this->expiryFirst = $expiryFirst;
    }

    public function getExpiryFirst()
    {
        return $this->expiryFirst;
    }

    public function setExpiryLast($expiryLast)
    {
        if (!TimestampValidator::isValid($expiryLast)) {
            throw new MedicineException('Invalid expiry timestamp: '.$expiryLast);
        }

        $this->expiryLast = $expiryLast;
    }

    public function getExpiryLast()
    {
        return $this->expiryLast;
    }

    public function setCost($cost)
    {
        $this->cost = $cost;
    }

    public function getCost()
    {
        return $this->cost;
    }

    public function setPrice($price)
    {
        $this->price = $price;
    }

    public function getPrice()
    {
        return $this->price;
    }

    public function getQuantity()
    {
        return $this->quantity;
    }

    public function addQuantity($add)
    {
        $this->quantity += $add;
    }

    public function reduceQuantity($reduce)
    {
        if (($this->quantity - $reduce) < 0) {
            throw new OutOfStockException(sprintf('Tried to reduce %s but stock is %s', $reduce, $this->quantity));
        }

        $this->quantity -= $reduce;
    }
}
