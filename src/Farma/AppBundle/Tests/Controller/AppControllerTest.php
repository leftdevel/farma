<?php

namespace Farma\AppBundle\Tests\Controller;

use Symfony\Component\HttpFoundation\Response;

use Farma\UserBundle\DataFixtures\ORM\LoadData as UserFixtures,
    Farma\BaseBundle\Tests\Utils\FunctionalTestUtil;

class AppControllerTest extends FunctionalTestUtil
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

    public function testIndexAction_security()
    {
        $url = $this->router->generate('app_index');

        // ANON
        $this->client->request('GET', $url);
        $this->assertEquals(Response::HTTP_FOUND,  $this->client->getResponse()->getStatusCode());

        // AUTH
        $this->authenticateClientForUser($this->client, $this->findGrocer());
        $this->client->request('GET', $url);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
    }

    public function testIndexAction_response()
    {
        $url = $this->router->generate('app_index');
        $this->authenticateClientForUser($this->client, $this->findGrocer());
        $crawler = $this->client->request('GET', $url);
        $this->assertEquals(1, $crawler->filter('#app')->count());
    }

    public function testSettingsAction_security()
    {
        $url = $this->router->generate('app_settings');

        // ANON
        $this->client->request('GET', $url);
        $this->assertEquals(Response::HTTP_FOUND,  $this->client->getResponse()->getStatusCode());

        // AUTH
        $this->authenticateClientForUser($this->client, $this->findGrocer());
        $this->client->request('GET', $url);
        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
    }

    public function testSettingsAction_response()
    {
        $url = $this->router->generate('app_settings');
        $grocer = $this->findGrocer();

        $this->authenticateClientForUser($this->client, $grocer);
        $this->client->request('GET', $url);
        $settings = @json_decode($this->client->getResponse()->getContent(), true);

        $this->assertTrue(is_array($settings));

        $user = $settings['user'];
        $this->assertEquals($grocer->getFullName(), $user['full_name']);
        $this->assertTrue(isset($user['email']));
        $this->assertTrue(isset($user['roles']));
        $this->assertFalse(isset($user['password']));
    }
}
