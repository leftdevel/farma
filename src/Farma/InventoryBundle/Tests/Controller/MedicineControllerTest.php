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
        $this->assertEquals(6, count($medicines));

        $medicine = $medicines[0];
        $this->assertEquals('aleve', strtolower($medicine['name']));
    }
}