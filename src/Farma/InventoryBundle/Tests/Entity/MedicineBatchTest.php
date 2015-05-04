<?php

namespace Farma\InventoryBundle\Tests\Entity;

use Farma\InventoryBundle\Entity\MedicineBatch;

class MedicineBatchTest extends \PHPUnit_Framework_TestCase
{
    private $batch;

    protected function setUp()
    {
        $this->batch = new MedicineBatch();
    }

    public function testSetExpiry_fail()
    {
        $this->setExpectedException('Farma\InventoryBundle\Entity\MedicineException');
        $invalidTimestamp = 100;
        $this->batch->setExpiry($invalidTimestamp);
    }

    public function testSetExpiry_success()
    {
        $expiry = new \DateTime('now + 15 days');
        $timestamp = $expiry->getTimestamp();
        $this->batch->setExpiry($timestamp);

        $this->assertEquals($timestamp, $this->batch->getExpiry());
    }
}