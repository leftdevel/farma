<?php

namespace Farma\BaseBundle\Tests\Utils;

use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpKernel\HttpKernelInterface,
    Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Bundle\FrameworkBundle\Client,
    Symfony\Component\BrowserKit\Cookie,
    Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken,
    Symfony\Bundle\FrameworkBundle\Console\Application,
    Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

abstract class FunctionalTestUtil extends WebTestCase
{
    private static $conn;
    private $fixtureLoader;
    private $databaseSetup;

    public function __construct()
    {
        $this->fixtureLoader = new FixtureLoader();
        $this->databaseSetup = new DatabaseSetup();
    }

    protected function authenticateClientForUser(Client $client, UserInterface $user)
    {
        $client->request('GET', '/');
        $container = $client->getContainer();
        $session   = $container->get('session');

        if (!$session->isStarted()) {
            $session->start();
        }

        $client->getCookieJar()->set(new Cookie($session->getName(), $session->getId()));

        $firewallName = 'farma_firewall';

        $token = new UsernamePasswordToken($user, null, $firewallName, $user->getRoles());
        $session->set('_security_' . $firewallName, serialize($token));
        $session->save();

        return $client;
    }

    protected function deauthenticateClient(Client $client)
    {
        $client->getCookieJar()->clear();

        return $client;
    }

    public function formatPostData($fields)
    {
        $qs = http_build_query($fields, '', '&');
        parse_str($qs, $values);

        return $values;
    }

    static protected function createClient(array $options = array(), array $server = array())
    {
        if (!static::$kernel) {
            self::$kernel = self::createKernel($options);
            self::$kernel->boot();
            self::$conn = self::$kernel->getContainer()->get('doctrine.dbal.default_connection');
        } else {
            self::$kernel->boot();
            self::$kernel->getContainer()->set('doctrine.dbal.default_connection', self::$conn);
        }

        $client = self::$kernel->getContainer()->get('test.client');
        $client->setServerParameters($server);

        $container = $client->getContainer();
        $session   = $container->get('session');
        $session->clear();

        return $client;
    }

    public function dumpContent(Client $client)
    {
        var_export($client->getResponse()->getContent());
        die();
    }

    public function loadFixtures(array $fixtures)
    {
        return $this->fixtureLoader->load($fixtures, self::$kernel->getContainer());
    }

    public function setupDatabase()
    {
        $this->databaseSetup->setupApplication(self::$kernel);
        $this->databaseSetup->setup();
    }

    public function destroy(Client $client)
    {
        $this->deauthenticateClient($client);
        $client->restart();
        $this->databaseTeardown();
        $this->clientTearDown($client);
    }

    private function databaseTeardown()
    {
        $this->databaseSetup->setupApplication(self::$kernel);
        $this->databaseSetup->tearDown();
    }

    private function clientTearDown(Client $client)
    {
        $connection = $client->getContainer()->get('doctrine.orm.entity_manager')->getConnection();
        $connection->close();
        unset($connection);
        unset($client);
        self::$kernel == null;
    }

    public function findUser($email)
    {
        $repository = self::$kernel->getContainer()->get('user.repository');
        return $repository->findOneBy(array('email' => $email));
    }

    public function findSuperAdmin()
    {
        return $this->findUser('superadmin@farma.com');
    }

    public function findAdmin()
    {
        return $this->findUser('admin@farma.com');
    }

    public function findSeller()
    {
        return $this->findUser('vendedor@farma.com');
    }

    public function findGrocer()
    {
        return $this->findUser('bodeguero@farma.com');
    }

    public function renderController($client, $controller, $path, $query = array())
    {
        $client->request('GET', '/');
        $container = $client->getContainer();
        $path['_controller'] = $controller;
        $masterRequest = $client->getRequest();
        $subRequest = $masterRequest->duplicate($query, null, $path);

        return $container->get('http_kernel')->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
    }
}