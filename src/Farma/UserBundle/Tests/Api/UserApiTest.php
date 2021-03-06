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

    // LIST

    public function testListAll()
    {
        $records = $this->userApi->listAll();
        $this->assertEquals(4, count($records));

        $expectedColumns = array('id', 'full_name', 'email', 'roles');
        $actualColumns = array_keys($records[0]);

        $this->assertEquals(count($expectedColumns), count($actualColumns));
        $this->assertEquals(0, count(array_diff($expectedColumns, $actualColumns)));
        $this->assertEquals('Superadmin Farma', $records[0]['full_name']);
        $this->assertTrue(is_array($records[0]['roles']));
    }

    public function testListAll_filter_fail()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');

        $filters = array(
            'password' => 'anything'
        );

        $this->userApi->ListAll($filters);
    }

    public function testListAll_filter_email()
    {
        $filters = array(
            'email' => 'unexisting@farma.com'
        );

        $records = $this->userApi->listAll($filters);
        $this->assertEquals(0, count($records));

        $grocer = $this->findGrocer();

        $filters = array(
            'email' => $grocer->getEmail(),
        );

        $records = $this->userApi->listAll($filters);
        $this->assertEquals(1, count($records));
        $user = $records[0];
        $this->assertEquals($grocer->getEmail(), $user['email']);
    }

    // FIND

    public function testFindOneById()
    {
        $unexistingId = 10000;
        $result = $this->userApi->findOneById($unexistingId);
        $this->assertNull($result);

        $existingId = 1;
        $result = $this->userApi->findOneById($existingId);
        $this->assertNotNull($result);
        $this->assertTrue(isset($result['id']));
        $this->assertTrue(isset($result['full_name']));
        $this->assertTrue(isset($result['email']));
        $this->assertTrue(isset($result['roles']));
        $this->assertTrue(is_array($result['roles']));

        $this->assertFalse(isset($result['password']));
    }

    // CREATE

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
            'full_name' => 'John Doe 1',
            'email' => 'jhon@farma.com',
            'password_mispelled' => 'farma'
        );
        $this->userApi->create($input);
    }

    public function testCreate_fail_invalid_role()
    {
        $this->setExpectedException('Farma\UserBundle\Entity\UserException');
        $input = array(
            'full_name' => 'John Doe 2',
            'email' => 'jhon@farma.com',
            'password' => 'farma',
            'roles' => array('ROLE_DOES_NOT_EXISTS')
        );
        $this->userApi->create($input);
    }

    public function testCreate_fail_prevent_super_admin_role()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $input = array(
            'full_name' => 'John Doe 3',
            'email' => 'jhon@farma.com',
            'password' => 'farma',
            'roles' => array(UserRole::SUPER_ADMIN),
        );
        $this->userApi->create($input);
    }

    public function testCreate_fail_user_exists_already()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $input = array(
            'full_name' => 'John Doe 4',
            'email' => 'admin@farma.com',
            'password' => 'farma',
            'roles' => array(UserRole::ADMIN),
        );
        $this->userApi->create($input);
    }

    public function testCreate_fail_blank_full_name()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $input = array(
            'full_name' => '',
            'email' => 'admin@farma.com',
            'password' => 'farma',
            'roles' => array(UserRole::ADMIN),
        );
        $this->userApi->create($input);
    }

    public function testCreate_fail_blank_password()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $input = array(
            'full_name' => 'John Doe 5',
            'email' => 'john@farma.com',
            'password' => '',
            'roles' => array(UserRole::SALES),
        );
        $this->userApi->create($input);
    }

    public function testCreate_success()
    {
        $input = array(
            'full_name' => 'John Doe 6',
            'email' => 'jhon@farma.com',
            'password' => 'farma',
            'roles' => array(UserRole::ADMIN),
        );

        $this->userApi->create($input);

        $user = $this->findUser('jhon@farma.com');
        $this->assertTrue($user instanceof User);
    }

    // UPDATE

    public function testUpdate_fail_empty()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $seller = $this->findSeller();
        $input = array();
        $this->userApi->update($seller, $input);
    }

    public function testUpdate_fail_new_email_is_already_taken()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $seller = $this->findSeller();

        $input = array(
            'full_name' => 'John Doe 77',
            'email' => 'admin@farma.com',
            'roles' => array(UserRole::ADMIN),
        );

        $this->userApi->update($seller, $input);
    }

    public function testUpdate_fail_cannot_remove_superadmin_role()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $superAdmin = $this->findSuperAdmin();
        $input = array(
            'full_name' => $superAdmin->getFullName(),
            'email' => $superAdmin->getEmail(),
            'roles' => array(UserRole::ADMIN),
        );
        $this->userApi->update($superAdmin, $input);
    }

    public function testUpdate_fail_cannot_add_superadmin_role()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $seller = $this->findSeller();
        $input = array(
            'full_name' => $seller->getFullName(),
            'email' => $seller->getEmail(),
            'roles' => array(UserRole::SUPER_ADMIN),
        );

        $this->userApi->update($seller, $input);
    }

    public function testUpdate_success_superadmin_has_same_role()
    {
        $superAdmin = $this->findSuperAdmin();
        $input = array(
            'full_name' => 'Super Admin Updated',
            'email' => $superAdmin->getEmail(),
            'roles' => array(UserRole::SUPER_ADMIN),
        );

        $this->userApi->update($superAdmin, $input);
        $this->assertEquals('Super Admin Updated', $superAdmin->getFullName());
    }

    public function testUpdate_success_seller_admin_role()
    {
        $seller = $this->findSeller();
        $input = array(
            'full_name' => $seller->getFullName(),
            'email' => $seller->getEmail(),
            'roles' => array(UserRole::ADMIN)
        );
        $this->userApi->update($seller, $input);
        $this->assertTrue(in_array(UserRole::ADMIN, $seller->getRoles()));
    }

    public function testUpdate_success_new_email()
    {
        $seller = $this->findSeller();
        $input = array(
            'full_name' => $seller->getFullName(),
            'email' => 'newseller@farma.com',
            'roles' => $seller->getRoles(),
        );

        $this->userApi->update($seller, $input);
        $this->assertEquals('newseller@farma.com', $seller->getEmail());
    }

    public function testUpdate_success_new_fullname()
    {
        $seller = $this->findSeller();
        $input = array(
            'full_name' => 'New Seller',
            'email' => $seller->getEmail(),
            'roles' => $seller->getRoles(),
        );
        $this->userApi->update($seller, $input);
        $this->assertEquals('New Seller', $seller->getFullName());
    }

    public function testUpdate_success_same_password()
    {
        $seller = $this->findSeller();
        $currentPassword = $seller->getPassword();

        $input = array(
            'full_name' => $seller->getFullName(),
            'email' => $seller->getEmail(),
            'roles' => $seller->getRoles(),
        );
        $this->userApi->update($seller, $input);

        $this->assertEquals($currentPassword, $seller->getPassword());
    }

    public function testUpdate_success_new_password()
    {
        $seller = $this->findSeller();
        $currentPassword = $seller->getPassword();
        $newRawPassword = '123';

        $input = array(
            'full_name' => $seller->getFullName(),
            'email' => $seller->getEmail(),
            'roles' => $seller->getRoles(),
            'password' => $newRawPassword,
        );
        $this->userApi->update($seller, $input);

        $this->assertNotEquals($currentPassword, $seller->getPassword());
        $this->assertNotEquals($newRawPassword, $seller->getPassword());

        $encoder = $this->container->get('security.password_encoder');
        $encodedPassword = $encoder->encodePassword($seller, $newRawPassword);

        $this->assertEquals($encodedPassword, $seller->getPassword());
    }

    // DELETE

    public function testDelete_fail_cannot_delete_superadmin()
    {
        $this->setExpectedException('Farma\UserBundle\Api\UserApiException');
        $superAdmin = $this->findSuperAdmin();
        $this->userApi->delete($superAdmin);
    }

    public function testDelete_success()
    {
        $seller = $this->findSeller();
        $admin = $this->findAdmin();

        $this->userApi->delete($seller);
        $this->userApi->delete($admin);

        $seller = $this->findSeller();
        $admin = $this->findAdmin();

        $this->assertNull($seller);
        $this->assertNull($admin);
    }
}