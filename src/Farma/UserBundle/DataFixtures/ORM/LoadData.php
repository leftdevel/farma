<?php

namespace Farma\UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture,
    Doctrine\Common\DataFixtures\OrderedFixtureInterface,
    Doctrine\Common\Persistence\ObjectManager;

use Symfony\Component\DependencyInjection\ContainerAwareInterface,
    Symfony\Component\DependencyInjection\ContainerInterface,
    Symfony\Component\Security\Core\User\UserInterface;

use Farma\UserBundle\Entity\User;

class LoadData extends AbstractFixture implements OrderedFixtureInterface, ContainerAwareInterface
{
    private $container;
    private $entityManager;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $entityManager)
    {
        $this->entityManager  = $entityManager;
        $this->createUsers();
    }

    private function createUsers()
    {
        $admin = $this->createUser('admin', array('ROLE_ADMIN'));
        $this->entityManager->persist($admin);

        $seller = $this->createUser('seller');
        $this->entityManager->persist($seller);

        $this->entityManager->flush();
    }

    private function createUser($username, array $roles = array())
    {
        $user = new User();
        $user->setRoles($roles);
        $user->setEmail($username.'@farma.com');
        $user->setFullName(ucfirst($username).' Flightfox');

        $plainPassword = 'farma';
        $user->setPassword($this->encodePassword($user, $plainPassword));

        $reference = 'User.'.ucfirst($username);
        $this->setReference($reference, $user);

        return $user;
    }

    private function encodePassword(UserInterface $user, $plainPassword)
    {
        $encoder = $this->container->get('security.password_encoder');
        return $encoder->encodePassword($user, $plainPassword);
    }

    public function getOrder()
    {
        return 1;
    }
}
