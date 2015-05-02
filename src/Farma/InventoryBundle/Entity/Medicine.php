<?php

namespace Farma\InventoryBundle\Entity;

use Farma\BaseBundle\Util\StringToIndexTransformer,
    Farma\BaseBundle\Util\TimestampValidator;

class Medicine
{
    private $id;
    private $created;
    private $updated;

    private $name;
    private $nameNormalized;
    private $generic;
    private $genericNormalized;
    private $laboratory;
    private $laboratoryNormalized;
    private $presentation;
    private $presentationNormalized;
    private $concentration;
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
        $this->name = $name;
        $this->nameNormalized = StringToIndexTransformer::transform($name);
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
        $this->generic = $generic;
        $this->genericNormalized = StringToIndexTransformer::transform($generic);
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
        $this->laboratory = $laboratory;
        $this->laboratoryNormalized = StringToIndexTransformer::transform($laboratory);
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
        $this->presentation = $presentation;
        $this->presentationNormalized = StringToIndexTransformer::transform($presentation);
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
        $this->concentration = $concentration;
        $this->concentrationNormalized = StringToIndexTransformer::transform($concentration);
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
