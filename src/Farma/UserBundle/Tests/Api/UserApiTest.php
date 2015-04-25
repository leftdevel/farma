<?php

namespace Farma\UserBundle\Tests\Api;

use Farma\UserBundle\DataFixtures\ORM\LoadData as UserFixtures,
    Farma\UserBundle\Entity\User,
    Farma\UserBundle\Model\UserRole,
    Farma\BaseBundle\Tests\Utils\FunctionalTestUtil;

class UserApiTest extends FunctionalTestUtil
{
    private $client;
    private $container;
    private $userApi;

    protected function setUp()
    {
        $this->client = $this->createClient();
        $this->setupDatabase();
        $this->loadFixtures(array(new UserFixtures()));
        $this->container = $this->client->getContainer();
        $this->userApi = $this->container->get('user.api');
    }

    protected function tearDown()
    {
        $this->destroy($this->client);
    }

    public function testListAll()
    {
        $records = $this->userApi->listAll();
        $this->assertEquals(4, count($records));

        $expectedColumns = array('id', 'full_name', 'email', 'flat_roles', 'created');
        $actualColumns = array_keys($records[0]);

        $this->assertEquals(count($expectedColumns), count($actualColumns));
        $this->assertEquals(0, count(array_diff($expectedColumns, $actualColumns)));
        $this->assertEquals('Superadmin Farma', $records[0]['full_name']);
    }

    public function testCreate_fail_empty()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $input = array();
        $this->userApi->create($input);
    }

    public function testCreate_fail_invalid_keys()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $input = array(
            'full_name' => 'John Doe',
            'email' => 'jhon@farma.com',
            'password_mispelled' => '12345'
        );
        $this->userApi->create($input);
    }

    public function testCreate_fail_invalid_role()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $input = array(
            'full_name' => 'John Doe',
            'email' => 'jhon@farma.com',
            'password' => '12345',
            'flat_roles' => 'ROLE_DOES_NOT_EXISTS'
        );
        $this->userApi->create($input);
    }

    public function testCreate_fail_prevent_super_admin_role()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $input = array(
            'full_name' => 'John Doe',
            'email' => 'jhon@farma.com',
            'password' => '12345',
            'flat_roles' => UserRole::SUPER_ADMIN,
        );
        $this->userApi->create($input);
    }

    public function testCreate_fail_user_exists_already()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $input = array(
            'full_name' => 'John Doe',
            'email' => 'admin@farma.com',
            'password' => '12345',
            'flat_roles' => UserRole::ADMIN,
        );
        $this->userApi->create($input);
    }

    public function testCreate_fail_empty_value()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $input = array(
            'full_name' => '',
            'email' => 'admin@farma.com',
            'password' => '12345',
            'flat_roles' => UserRole::ADMIN,
        );
        $this->userApi->create($input);
    }

    public function testCreate_success()
    {
        $input = array(
            'full_name' => 'John Doe',
            'email' => 'jhon@farma.com',
            'password' => '12345',
            'flat_roles' => UserRole::ADMIN,
        );

        $this->userApi->create($input);

        $user = $this->findUser('jhon@farma.com');
        $this->assertTrue($user instanceof User);
    }

    public function testUpdate_fail_empty()
    {
        $seller = $this->findSeller();
    }

    public function testUpdate_fail_invalid_input()
    {
        $seller = $this->findSeller();
    }
}