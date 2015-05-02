<?php

namespace Farma\InventoryBundle\Tests\Entity;

use Farma\InventoryBundle\Entity\Medicine;

class MedicineTest extends \PHPUnit_Framework_TestCase
{
    private $medicine;

    protected function setUp()
    {
        $this->medicine = new Medicine();
    }

    public function testSetName()
    {
        $name = 'balladares';
        $nameNormalized = 'balladares';
        $this->medicine->setName($name);
        $this->assertEquals($name, $this->medicine->getName());
        $this->assertEquals($nameNormalized, $this->medicine->getNameNormalized());

        $name = 'bàllâdarësñ';
        $nameNormalized = 'balladaresn';
        $this->medicine->setName($name);
        $this->assertEquals($name, $this->medicine->getName());
        $this->assertEquals($nameNormalized, $this->medicine->getNameNormalized());

        $name = 'BALLADARES';
        $nameNormalized = 'balladares';
        $this->medicine->setName($name);
        $this->assertEquals($name, $this->medicine->getName());
        $this->assertEquals($nameNormalized, $this->medicine->getNameNormalized());

        $name = 'BÁLLÀDÂRESÑ';
        $nameNormalized = 'balladaresn';
        $this->medicine->setName($name);
        $this->assertEquals($name, $this->medicine->getName());
        $this->assertEquals($nameNormalized, $this->medicine->getNameNormalized());
    }

    public function testSetGeneric()
    {
        $generic = 'balladares';
        $genericNormalized = 'balladares';
        $this->medicine->setGeneric($generic);
        $this->assertEquals($generic, $this->medicine->getGeneric());
        $this->assertEquals($generic, $this->medicine->getGenericNormalized());

        $generic = 'bàllâdarësñ';
        $genericNormalized = 'balladaresn';
        $this->medicine->setGeneric($generic);
        $this->assertEquals($generic, $this->medicine->getGeneric());
        $this->assertEquals($genericNormalized, $this->medicine->getGenericNormalized());

        $generic = 'BALLADARES';
        $genericNormalized = 'balladares';
        $this->medicine->setGeneric($generic);
        $this->assertEquals($generic, $this->medicine->getGeneric());
        $this->assertEquals($genericNormalized, $this->medicine->getGenericNormalized());

        $generic = 'BÁLLÀDÂRESÑ';
        $genericNormalized = 'balladaresn';
        $this->medicine->setGeneric($generic);
        $this->assertEquals($generic, $this->medicine->getGeneric());
        $this->assertEquals($genericNormalized, $this->medicine->getGenericNormalized());
    }

    public function testSetLaboratory()
    {
        $laboratory = 'balladares';
        $laboratoryNormalized = 'balladares';
        $this->medicine->setLaboratory($laboratory);
        $this->assertEquals($laboratory, $this->medicine->getLaboratory());
        $this->assertEquals($laboratoryNormalized, $this->medicine->getLaboratoryNormalized());

        $laboratory = 'bàllâdarësñ';
        $laboratoryNormalized = 'balladaresn';
        $this->medicine->setLaboratory($laboratory);
        $this->assertEquals($laboratory, $this->medicine->getLaboratory());
        $this->assertEquals($laboratoryNormalized, $this->medicine->getLaboratoryNormalized());

        $laboratory = 'BALLADARES';
        $laboratoryNormalized = 'balladares';
        $this->medicine->setLaboratory($laboratory);
        $this->assertEquals($laboratory, $this->medicine->getLaboratory());
        $this->assertEquals($laboratoryNormalized, $this->medicine->getLaboratoryNormalized());

        $laboratory = 'BÁLLÀDÂRESÑ';
        $laboratoryNormalized = 'balladaresn';
        $this->medicine->setLaboratory($laboratory);
        $this->assertEquals($laboratory, $this->medicine->getLaboratory());
        $this->assertEquals($laboratoryNormalized, $this->medicine->getLaboratoryNormalized());
    }

    public function testSetPresentation()
    {
        $presentation = 'balladares';
        $presentationNormalized = 'balladares';
        $this->medicine->setPresentation($presentation);
        $this->assertEquals($presentation, $this->medicine->getPresentation());
        $this->assertEquals($presentationNormalized, $this->medicine->getPresentationNormalized());

        $presentation = 'bàllâdarësñ';
        $presentationNormalized = 'balladaresn';
        $this->medicine->setPresentation($presentation);
        $this->assertEquals($presentation, $this->medicine->getPresentation());
        $this->assertEquals($presentationNormalized, $this->medicine->getPresentationNormalized());

        $presentation = 'BALLADARES';
        $presentationNormalized = 'balladares';
        $this->medicine->setPresentation($presentation);
        $this->assertEquals($presentation, $this->medicine->getPresentation());
        $this->assertEquals($presentationNormalized, $this->medicine->getPresentationNormalized());

        $presentation = 'BÁLLÀDÂRESÑ';
        $presentationNormalized = 'balladaresn';
        $this->medicine->setPresentation($presentation);
        $this->assertEquals($presentation, $this->medicine->getPresentation());
        $this->assertEquals($presentationNormalized, $this->medicine->getPresentationNormalized());
    }

    public function testSetConcentration()
    {
        $concentration = 'balladares';
        $concentrationNormalized = 'balladares';
        $this->medicine->setConcentration($concentration);
        $this->assertEquals($concentration, $this->medicine->getConcentration());
        $this->assertEquals($concentrationNormalized, $this->medicine->getConcentrationNormalized());

        $concentration = 'bàllâdarësñ';
        $concentrationNormalized = 'balladaresn';
        $this->medicine->setConcentration($concentration);
        $this->assertEquals($concentration, $this->medicine->getConcentration());
        $this->assertEquals($concentrationNormalized, $this->medicine->getConcentrationNormalized());

        $concentration = 'BALLADARES';
        $concentrationNormalized = 'balladares';
        $this->medicine->setConcentration($concentration);
        $this->assertEquals($concentration, $this->medicine->getConcentration());
        $this->assertEquals($concentrationNormalized, $this->medicine->getConcentrationNormalized());

        $concentration = 'BÁLLÀDÂRESÑ';
        $concentrationNormalized = 'balladaresn';
        $this->medicine->setConcentration($concentration);
        $this->assertEquals($concentration, $this->medicine->getConcentration());
        $this->assertEquals($concentrationNormalized, $this->medicine->getConcentrationNormalized());
    }

    public function testSetExpiry_throws_MedicineException()
    {
        // sets both expiry_first and expiry_last, also validates the timestamp.
        // Ignores a timestamp that is in between those dates if both are set.

        $this->setExpectedException('Farma\InventoryBundle\Entity\MedicineException');
        $invalidTimestamp = 12345;
        $this->medicine->setExpiry($invalidTimestamp);
    }

    public function testSetExpiry_first_last_equals()
    {
        $expiry = 1430521163;
        $this->medicine->setExpiry($expiry);

        $this->assertEquals($expiry, $this->medicine->getExpiryFirst());
        $this->assertEquals($expiry, $this->medicine->getExpiryLast());
    }

    public function testSetExpiry_replaces_first()
    {
        $expiry = 1430521163;
        $this->medicine->setExpiry($expiry);
        $expiryFirst = $expiry - 100;
        $this->medicine->setExpiry($expiryFirst);

        $this->assertEquals($expiryFirst, $this->medicine->getExpiryFirst());
        $this->assertEquals($expiry, $this->medicine->getExpiryLast());
    }

    public function testSetExpiry_replaces_last()
    {
        $expiry = 1430521163;
        $this->medicine->setExpiry($expiry);
        $expiryLast = $expiry + 100;
        $this->medicine->setExpiry($expiryLast);

        $this->assertEquals($expiry, $this->medicine->getExpiryFirst());
        $this->assertEquals($expiryLast, $this->medicine->getExpiryLast());
    }

    public function testSetExpiry_ignored()
    {
        $expiryFirst = 1430521163;
        $this->medicine->setExpiry($expiryFirst);
        $expiryLast = $expiryFirst + 100;
        $this->medicine->setExpiry($expiryLast);
        $expiryBetween = $expiryFirst + 50;
        $this->medicine->setExpiry($expiryBetween);

        $this->assertEquals($expiryFirst, $this->medicine->getExpiryFirst());
        $this->assertEquals($expiryLast, $this->medicine->getExpiryLast());
    }
}
