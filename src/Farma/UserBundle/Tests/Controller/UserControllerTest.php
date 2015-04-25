<?php

namespace Farma\UserBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;

use Farma\UserBundle\DataFixtures\ORM\LoadData as UserFixtures,
    Farma\BaseBundle\Tests\Utils\FunctionalTestUtil;

class UserControllerTest extends FunctionalTestUtil
{
    private $client;
    private $container;
    private $router;

    protected function setUp()
    {
        $this->client = $this->createClient();
        $this->setupDatabase();
        $this->loadFixtures(array(new UserFixtures()));
        $this->container = $this->client->getContainer();
        $this->router = $this->container->get('router');
    }

    protected function tearDown()
    {
        $this->destroy($this->client);
    }

    public function testListAction_security()
    {
        $url = $this->router->generate('user_list');

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
        $this->assertEquals(Response::HTTP_FORBIDDEN, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // ADMIN
        $this->authenticateClientForUser($this->client, $this->findAdmin());
        $this->client->request('GET', $url);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // SUPER ADMIN
        $this->authenticateClientForUser($this->client, $this->findSuperAdmin());
        $this->client->request('GET', $url);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);
    }

    public function testListAction_response()
    {
        $this->authenticateClientForUser($this->client, $this->findAdmin());
        $url = $this->router->generate('user_list');
        $this->client->request('GET', $url);

        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());

        $headers = iterator_to_array($response->headers->getIterator());
        $this->assertEquals('application/json', $headers['content-type'][0]);

        $records = @json_decode($response->getContent(), true);
        $this->assertEquals(4, count($records));
        $this->assertEquals('Superadmin Farma', $records[0]['full_name']);
    }
}
