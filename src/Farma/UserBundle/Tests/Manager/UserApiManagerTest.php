<?php

namespace Farma\UserBundle\Tests\Manager;

use Farma\UserBundle\DataFixtures\ORM\LoadData as UserFixtures,
    Farma\BaseBundle\Tests\Utils\FunctionalTestUtil;

class UserApiManagerTest extends FunctionalTestUtil
{
    private $client;
    private $container;
    private $userApiManager;

    protected function setUp()
    {
        $this->client = $this->createClient();
        $this->setupDatabase();
        $this->loadFixtures(array(new UserFixtures()));
        $this->container = $this->client->getContainer();
        $this->userApiManager = $this->container->get('user.manager.api');
    }

    protected function tearDown()
    {
        $this->destroy($this->client);
    }

    public function testListAll()
    {
        $records = $this->userApiManager->listAll();
        $this->assertEquals(4, count($records));

        $expectedColumns = array('id', 'full_name', 'email', 'roles', 'created');
        $actualColumns = array_keys($records[0]);

        $this->assertEquals(count($expectedColumns), count($actualColumns));
        $this->assertEquals(0, count(array_diff_key($expectedColumns, $actualColumns)));
    }
}