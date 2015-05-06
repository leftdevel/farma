<?php

namespace Farma\InventoryBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;

use Farma\BaseBundle\Tests\Utils\FunctionalTestUtil,
    Farma\InventoryBundle\DataFixtures\ORM\LoadMedicineData as MedicineFixtures,
    Farma\UserBundle\DataFixtures\ORM\LoadData as UserFixtures;

class MedicineControllerTest extends FunctionalTestUtil
{
    private $client;
    private $container;
    private $router;

    protected function setUp()
    {
        $this->client = $this->createClient();
        $this->setupDatabase();
        $this->loadFixtures(array(new UserFixtures(), new MedicineFixtures()));
        $this->container = $this->client->getContainer();
        $this->router = $this->container->get('router');
    }

    protected function tearDown()
    {
        $this->destroy($this->client);
    }

    public function testListAction_security()
    {
        $url = $this->router->generate('medicine_list');

        // ANON
        $this->client->request('GET', $url);
        $this->assertEquals(Response::HTTP_FOUND, $this->client->getResponse()->getStatusCode());

        // SELLER
        $this->authenticateClientForUser($this->client, $this->findSeller());
        $this->client->request('GET', $url);
        $this->assertEquals(Response::HTTP_FORBIDDEN, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // GROCER
        $this->authenticateClientForUser($this->client, $this->findGrocer());
        $this->client->request('GET', $url);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // ADMIN
        $this->authenticateClientForUser($this->client, $this->findAdmin());
        $this->client->request('GET', $url);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
    }

    public function testListAction_response()
    {
        $url = $this->router->generate('medicine_list');
        $this->authenticateClientForUser($this->client, $this->findGrocer());
        $this->client->request('GET', $url);

        $medicines = @json_decode($this->client->getResponse()->getContent(), true);

        $this->assertTrue(is_array($medicines));
        $this->assertEquals(7, count($medicines));

        $medicine = $medicines[0];
        $this->assertEquals('aleve', strtolower($medicine['name']));
    }

    public function testCreateAction_security()
    {
        $input = json_encode(array(
            'name' => 'tylenol',
            'generic' => 'acetaminofen',
            'laboratory' => 'EA',
            'presentation' => 'jarabe',
            'concentration' => '300mg',
            'quantity' => 20,
            'cost' => 10,
            'price' => 15,
            'expiry' => time()
        ));

        $url = $this->router->generate('medicine_create');

        // ANON
        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_FOUND, $this->client->getResponse()->getStatusCode());

        // SELLER
        $this->authenticateClientForUser($this->client, $this->findSeller());
        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_FORBIDDEN, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // GROCER
        $this->authenticateClientForUser($this->client, $this->findGrocer());
        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_CREATED, $this->client->getResponse()->getStatusCode());
    }

    public function testCreateAction_response()
    {
        $input = json_encode(array(
            'name' => 'tylenol',
            'generic' => 'acetaminofen',
            'laboratory' => 'EA',
            'presentation' => 'jarabe',
            'concentration' => '300mg',
            'quantity' => 20,
            'cost' => 10,
            'price' => 15,
            'expiry' => time()
        ));

        $repository = $this->container->get('inventory.repository.medicine');
        $medicines = $repository->findAll();
        $initialCount = count($medicines);
        $this->assertTrue($initialCount > 0);

        $url = $this->router->generate('medicine_create');
        $this->authenticateClientForUser($this->client, $this->findGrocer());
        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_CREATED, $this->client->getResponse()->getStatusCode());

        $content = @json_decode($this->client->getResponse()->getContent(), true);
        $this->assertTrue(is_array($content));
        $this->assertTrue(isset($content['success']));
        $this->assertTrue($content['success']);

        $medicines = $repository->findAll();
        $this->assertEquals($initialCount + 1, count($medicines));
    }
}