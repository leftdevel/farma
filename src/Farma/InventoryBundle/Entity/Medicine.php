<?php

namespace Farma\InventoryBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

use Farma\BaseBundle\Util\StringUtil,
    Farma\BaseBundle\Util\TimestampValidator;

/**
 * @ORM\Entity(repositoryClass="Farma\InventoryBundle\Repository\MedicineRepository")
 * @ORM\Table(name="medicine")
 */
class Medicine
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
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $laboratory;

    /**
     * @ORM\Column(type="string", length=255, name="laboratory_normalized")
     * @Assert\NotBlank()
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
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $concentration;

    /**
     * @ORM\Column(type="string", length=255, name="concentration_normalized")
     * @Assert\NotBlank()
     */
    private $concentrationNormalized;

    private $expiryFirst;
    private $expiryLast;

    public function __construct()
    {
        $time = time();
        $this->created = $time;
        $this->updated = $time;
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
        $this->nameNormalized = StringUtil::createIndexableValue($name);
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
        $this->genericNormalized = StringUtil::createIndexableValue($generic);
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
        $this->laboratoryNormalized = StringUtil::createIndexableValue($laboratory);
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
        $this->presentationNormalized = StringUtil::createIndexableValue($presentation);
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
        $this->concentrationNormalized = StringUtil::createIndexableValue($concentration);
    }

    public function getConcentration()
    {
        return $this->concentration;
    }

    public function getConcentrationNormalized()
    {
        return $this->concentrationNormalized;
    }

    public function setExpiry($expiry)
    {
        if (!TimestampValidator::isValid($expiry)) {
            throw new MedicineException('Invalid expiry timestamp: '.$expiry);
        }

        if (!$this->expiryFirst) {
            $this->expiryFirst = $expiry;
            $this->expiryLast = $expiry;

            return;
        }

        if ($expiry < $this->expiryFirst) {
            $this->expiryFirst = $expiry;
        } elseif ($expiry > $this->expiryLast) {
            $this->expiryLast = $expiry;
        }
    }

    public function getExpiryFirst()
    {
        return $this->expiryFirst;
    }

    public function getExpiryLast()
    {
        return $this->expiryLast;
    }
}
