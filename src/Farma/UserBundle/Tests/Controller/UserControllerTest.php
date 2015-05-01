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

    public function testListAction_filter_email()
    {
        $this->authenticateClientForUser($this->client, $this->findAdmin());

        // 0 results.

        $unexistingEmail = 'nonexisting@none.com';
        $url = $this->router->generate('user_list', array('email' => $unexistingEmail));
        $this->client->request('GET', $url);

        $users = @json_decode($this->client->getResponse()->getContent(), true);
        $this->assertTrue(is_array($users));
        $this->assertEquals(0, count($users));

        // 1 result

        $grocer = $this->findGrocer();
        $existingEmail = $grocer->getEmail();
        $url = $this->router->generate('user_list', array('email' => $existingEmail));
        $this->client->request('GET', $url);

        $users = @json_decode($this->client->getResponse()->getContent(), true);
        $this->assertTrue(is_array($users));
        $this->assertEquals(1, count($users));
        $user = $users[0];
        $this->assertEquals($grocer->getEmail(), $user['email']);
    }

    // CREATE

    public function testCreateAction_security()
    {
        $url = $this->router->generate('user_create');

        $input = json_encode(array(
            'full_name' => 'John Doe',
            'email' => 'john@farma.com',
            'password' => 'farma',
            'roles' => array('ROLE_SELLER')
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
            'roles' => array('ROLE_ADMIN')
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
            'roles' => array('ROLE_ADMIN')
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
            'roles' => $seller->getRoles(),
        ));

        // ANON
        $this->client->request('PUT', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_FOUND, $this->client->getResponse()->getStatusCode());

        // GROCER
        $this->authenticateClientForUser($this->client, $grocer);
        $this->client->request('PUT', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_FORBIDDEN, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // ADMIN
        $this->authenticateClientForUser($this->client, $admin);
        $this->client->request('PUT', $url, array(), array(), array(), $input);
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
            'roles' => $superAdmin->getRoles(),
        ));

        $this->authenticateClientForUser($this->client, $admin);
        $this->client->request('PUT', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_FORBIDDEN, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        $this->authenticateClientForUser($this->client, $superAdmin);
        $this->client->request('PUT', $url, array(), array(), array(), $input);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
    }

    // DELETE

    public function testDeleteAction_security()
    {
        $seller = $this->findSeller();
        $url = $this->router->generate('user_delete', array('id' => $seller->getId()));

        // ANON
        $this->client->request('DELETE', $url);
        $this->assertEquals(Response::HTTP_FOUND, $this->client->getResponse()->getStatusCode());

        // GROCER
        $grocer = $this->findGrocer();
        $this->authenticateClientForUser($this->client, $grocer);
        $this->client->request('DELETE', $url);
        $this->assertEquals(Response::HTTP_FORBIDDEN, $this->client->getResponse()->getStatusCode());
        $this->deauthenticateClient($this->client);

        // ADMIN
        $admin = $this->findAdmin();
        $this->authenticateClientForUser($this->client, $admin);
        $this->client->request('DELETE', $url);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
    }

    public function testDeleteAction_fail_cannot_delete_super_admin()
    {
        $superAdmin = $this->findSuperAdmin();
        $url = $this->router->generate('user_delete', array('id' => $superAdmin->getId()));

        $this->authenticateClientForUser($this->client, $superAdmin);
        $this->client->request('DELETE', $url);
        $this->assertEquals(Response::HTTP_FORBIDDEN, $this->client->getResponse()->getStatusCode());
    }

    public function testDeleteAction_fail_cannot_delete_self()
    {
        $admin = $this->findAdmin();
        $url = $this->router->generate('user_delete', array('id' => $admin->getId()));

        $this->authenticateClientForUser($this->client, $admin);
        $this->client->request('DELETE', $url);
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $this->client->getResponse()->getStatusCode());
    }

    public function testDeleteAction_success()
    {
        $seller = $this->findSeller();
        $url = $this->router->generate('user_delete', array('id' => $seller->getId()));

        $superAdmin = $this->findSuperAdmin();
        $this->authenticateClientForUser($this->client, $superAdmin);
        $this->client->request('DELETE', $url);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
        $seller = $this->findSeller();
        $this->assertNull($seller);
    }
}
