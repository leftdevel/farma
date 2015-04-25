<?php

namespace Farma\BaseBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

use Farma\UserBundle\DataFixtures\ORM\LoadData as UserFixtures,
    Farma\BaseBundle\Tests\Utils\FunctionalTestUtil;

class BaseControllerTest extends FunctionalTestUtil
{
    private $client;
    private $router;

    protected function setUp()
    {
        $this->client = $this->createClient();
        $this->setupDatabase();
        $this->loadFixtures(array(new UserFixtures()));
        $this->container = $this->client->getContainer();
        $this->router = $this->container->get('router');
    }

    public function testIndexAction()
    {
        $this->client->request('GET', $this->router->generate('base_index'));
        $this->assertEquals(200, $this->client->getResponse()->getStatusCode());
    }

    public function testFailedLogin()
    {
        $url = $this->router->generate('_base_login');
        $crawler = $this->client->request('GET', $url);
        $form = $crawler->filter('button')->first()->form(array(
            '_username' => 'admin@farma.com',
            '_password' => 'wrong password'
        ));

        $this->client->submit($form);
        $crawler = $this->client->followRedirect();
        $this->assertContains('Acceder', $crawler->filter('#content')->text());
    }

    public function testSuccessLogin()
    {
        $url = $this->router->generate('_base_login');
        $crawler = $this->client->request('GET', $url);
        $form = $crawler->filter('button')->first()->form(array(
            '_username' => 'admin@farma.com',
            '_password' => 'farma'
        ));

        $this->client->submit($form);
        $crawler = $this->client->followRedirect();
        $this->assertContains('Comenzar', $crawler->filter('#content')->text());
    }
}
