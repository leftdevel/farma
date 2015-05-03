<?php

namespace Farma\InventoryBundle\Tests\Api;

use Farma\InventoryBundle\DataFixtures\ORM\LoadMedicineData as MedicineFixtures,
    Farma\BaseBundle\Tests\Utils\FunctionalTestUtil;

class MedicineApiTest extends FunctionalTestUtil
{
    private $client;
    private $container;
    private $medicineApi;

    protected function setUp()
    {
        $this->client = $this->createClient();
        $this->setupDatabase();
        $this->loadFixtures(array(new MedicineFixtures()));
        $this->container = $this->client->getContainer();
        $this->medicineApi = $this->container->get('inventory.api.medicine');
    }

    protected function tearDown()
    {
        $this->destroy($this->client);
    }


    public function testListAll()
    {
        $medicines = $this->medicineApi->listAll();

        $this->assertTrue(is_array($medicines));
        $this->assertEquals(6, count($medicines));

        $medicine = $medicines[0];
        $this->assertTrue(isset($medicine['id']));

        $this->assertTrue(isset($medicine['name']));
        $this->assertTrue(isset($medicine['name_normalized']));

        $this->assertTrue(isset($medicine['generic']));
        $this->assertTrue(isset($medicine['generic_normalized']));

        $this->assertTrue(isset($medicine['laboratory']));
        $this->assertTrue(isset($medicine['laboratory_normalized']));

        $this->assertTrue(isset($medicine['presentation']));
        $this->assertTrue(isset($medicine['presentation_normalized']));

        $this->assertTrue(isset($medicine['concentration']));
        $this->assertTrue(isset($medicine['concentration_normalized']));

        $this->assertTrue(isset($medicine['quantity']));
        $this->assertTrue(isset($medicine['cost']));
        $this->assertTrue(isset($medicine['price']));
        $this->assertTrue(isset($medicine['expiry_first']));
        $this->assertTrue(isset($medicine['expiry_last']));
        $this->assertTrue(isset($medicine['updated']));
    }
}