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

    // LIST

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

    public function testListAction_success()
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

    // CREATE

    public function testCreateAction_security()
    {
        $url = $this->router->generate('user_create');

        $input = json_encode(array(
            'full_name' => 'John Doe',
            'email' => 'john@farma.com',
            'password' => 'farma',
            'flat_roles' => 'ROLE_SELLER'
        ));

        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_FOUND, $this->client->getResponse()->getStatusCode());
    }

    public function testCreateAction_fail_bad_request()
    {
        $url = $this->router->generate('user_create');
        $this->authenticateClientForUser($this->client, $this->findAdmin());

        // User already exists
        $input = json_encode(array(
            'full_name' => 'admin',
            'email' => 'admin@farma.com',
            'password' => 'farma',
            'flat_roles' => 'ROLE_ADMIN'
        ));

        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $this->client->getResponse()->getStatusCode());
    }

    public function testCreateAction_success()
    {
        $url = $this->router->generate('user_create');
        $this->authenticateClientForUser($this->client, $this->findAdmin());

        // User already exists
        $input = json_encode(array(
            'full_name' => 'John Doe',
            'email' => 'john@farma.com',
            'password' => 'farma',
            'flat_roles' => 'ROLE_ADMIN'
        ));

        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(array('success' => true), @json_decode($this->client->getResponse()->getContent(), true));
        $this->assertEquals(Response::HTTP_CREATED, $this->client->getResponse()->getStatusCode());
    }

    // UPDATE

    public function testUpdateAction_security()
    {
        $seller = $this->findSeller();
        $grocer = $this->findGrocer();
        $admin = $this->findAdmin();
        $superAdmin = $this->findSuperAdmin();

        $url = $this->router->generate('user_update', array('id' => $seller->getId()));
        $input = json_encode(array(
            'full_name' => 'Some other name',
            'email' => $seller->getEmail(),
            'flat_roles' => $seller->getFlatRoles(),
        ));

        // ANON
        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_FOUND, $this->client->getResponse()->getStatusCode());

        // GROCER
        $this->authenticateClientForUser($this->client, $grocer);
        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_FORBIDDEN, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // ADMIN
        $this->authenticateClientForUser($this->client, $admin);
        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
        $seller = $this->findSeller();
        $this->assertEquals('Some other name', $seller->getFullName());
    }

    public function testUpdateAction_only_superadmin_can_update_himself()
    {
        $admin = $this->findAdmin();
        $superAdmin = $this->findSuperAdmin();

        $url = $this->router->generate('user_update', array('id' => $superAdmin->getId()));
        $input = json_encode(array(
            'full_name' => 'Some other name',
            'email' => $superAdmin->getEmail(),
            'flat_roles' => $superAdmin->getFlatRoles(),
        ));

        $this->authenticateClientForUser($this->client, $admin);
        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_FORBIDDEN, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        $this->authenticateClientForUser($this->client, $superAdmin);
        $this->client->request('POST', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
    }

    // DELETE
}
