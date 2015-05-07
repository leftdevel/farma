<?php

namespace Farma\InventoryBundle\Tests\Api;

use Farma\BaseBundle\Tests\Utils\FunctionalTestUtil,
    Farma\InventoryBundle\DataFixtures\ORM\LoadMedicineData as MedicineFixtures,
    Farma\UserBundle\DataFixtures\ORM\LoadData as UserFixtures;

class MedicineApiTest extends FunctionalTestUtil
{
    private $client;
    private $container;
    private $medicineApi;

    protected function setUp()
    {
        $this->client = $this->createClient();
        $this->setupDatabase();
        $this->loadFixtures(array(new UserFixtures(), new MedicineFixtures()));
        $this->container = $this->client->getContainer();
        $this->medicineApi = $this->container->get('inventory.api.medicine');
        $this->repository = $this->container->get('inventory.repository.medicine');
    }

    protected function tearDown()
    {
        $this->destroy($this->client);
    }

    public function testListAll()
    {
        $medicines = $this->medicineApi->listAll();

        $this->assertTrue(is_array($medicines));
        $this->assertEquals(7, count($medicines));

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

    public function testCreate_fail_missing_prop()
    {
        $this->setExpectedException('Farma\InventoryBundle\Api\MedicineApiException');

        $medicine = array(
            'name' => 'nusprin',
            'generic' => 'aspirin',
            'laboratory' => 'farmex',
            'presentation' => 'tablet',
            'concentration' => '100 mg',
            'quantity' => 20,
            'cost' => 5,
            'price' => 10,
        );

        $grocer = $this->findGrocer();

        $this->medicineApi->create($medicine, $grocer);
    }

    public function testCreate_batch_validation()
    {
        $this->setExpectedException('Farma\InventoryBundle\Api\MedicineApiException');

        $medicine = array(
            'name' => 'nusprin',
            'generic' => 'aspirin',
            'laboratory' => 'farmex',
            'presentation' => 'tablet',
            'concentration' => '100 mg',
            'price' => 'string again',

            'quantity' => 'a string',
            'cost' => 'another string',
            'expiry' => time(),
        );

        $grocer = $this->findGrocer();
        $this->medicineApi->create($medicine, $grocer);
    }

    public function testCreate_medicine_validation()
    {
        $this->setExpectedException('Farma\InventoryBundle\Api\MedicineApiException');

        $medicine = array(
            'name' => '',

            'generic' => 'aspirin',
            'laboratory' => 'farmex',
            'presentation' => 'tablet',
            'concentration' => '100 mg',
            'quantity' => 20,
            'cost' => 5,
            'price' => 10,
            'expiry' => time()
        );

        $grocer = $this->findGrocer();
        $this->medicineApi->create($medicine, $grocer);
    }

    public function testCreate_success()
    {
        $nusprinCollection = $this->repository->findByName('nusprin');
        $this->assertEquals(0, count($nusprinCollection));

        $expiry = new \DateTime('now + 20 days');

        $medicine = array(
            'name' => 'nusprin',
            'generic' => 'aspirin',
            'laboratory' => 'farmex',
            'presentation' => 'tablet',
            'concentration' => '100 mg',
            'quantity' => 20,
            'cost' => 5,
            'price' => 10,
            'expiry' => $expiry->getTimestamp()
        );

        $grocer = $this->findGrocer();
        $this->medicineApi->create($medicine, $grocer);

        $nusprinCollection = $this->repository->findByName('nusprin');
        $this->assertEquals(1, count($nusprinCollection));
        $nusprin = $nusprinCollection[0];
        $batches = $this->repository->findBatchesByMedicineId($nusprin->getId());
        $this->assertEquals(1, count($batches));

        $batch = $batches[0];
        $this->assertEquals($batch['medicine_id'], $nusprin->getId());
        $this->assertEquals($batch['quantity'], $nusprin->getQuantity());
        $this->assertEquals($batch['cost'], $nusprin->getCost());
        $this->assertEquals($batch['expiry'], $nusprin->getExpiryFirst());
        $this->assertEquals($batch['expiry'], $nusprin->getExpiryLast());
    }
}