<?php

namespace Farma\UserBundle\Tests\Controller;

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
        $redirectCode = 302;
        $forbiddenCode = 403;
        $successCode = 200;

        // ANON
        $this->client->request('GET', $url);
        $this->assertEquals($redirectCode, $this->client->getResponse()->getStatusCode());

        // SELLER
        $this->authenticateClientForUser($this->client, $this->findSeller());
        $this->client->request('GET', $url);
        $this->assertEquals($forbiddenCode, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // GROCER
        $this->authenticateClientForUser($this->client, $this->findGrocer());
        $this->client->request('GET', $url);
        $this->assertEquals($forbiddenCode, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // ADMIN
        $this->authenticateClientForUser($this->client, $this->findAdmin());
        $this->client->request('GET', $url);
        $this->assertEquals($successCode, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // SUPER ADMIN
        $this->authenticateClientForUser($this->client, $this->findSuperAdmin());
        $this->client->request('GET', $url);
        $this->assertEquals($successCode, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);
    }
}
