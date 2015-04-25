<?php

namespace Farma\UserBundle\Tests\Entity;

use Farma\UserBundle\Entity\User;

class UserTest extends \PHPUnit_Framework_TestCase
{
    public function testCreated()
    {
        $user = new User();
        $this->assertNotNull($user->getCreated());
        $this->assertEquals(10, strlen($user->getCreated()));
    }

    public function testIsActive()
    {
        $user = new User();
        $this->assertTrue($user->getIsActive());
    }

    public function testRoles()
    {
        $user = new User();
        $this->assertEquals(1, count($user->getRoles()));
        $this->assertTrue(in_array('ROLE_USER', $user->getRoles()));
        $this->assertFalse(in_array('ROLE_ADMIN', $user->getRoles()));

        $newRoles = array('ROLE_USER', 'ROLE_ADMIN');
        $user->setRoles($newRoles);

        $this->assertEquals(2, count($user->getRoles()));
        $this->assertTrue(in_array('ROLE_USER', $user->getRoles()));
        $this->assertTrue(in_array('ROLE_ADMIN', $user->getRoles()));

        $user->addRole('ROLE_USER');
        $this->assertEquals(2, count($user->getRoles()), 'Duplicate not allowed');

        $user->addRole('ROLE_SALES');
        $this->assertEquals(3, count($user->getRoles()));
        $this->assertTrue(in_array('ROLE_SALES', $user->getRoles()));
    }
}