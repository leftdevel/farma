<?php

namespace Farma\UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture,
    Doctrine\Common\DataFixtures\OrderedFixtureInterface,
    Doctrine\Common\Persistence\ObjectManager;

use Symfony\Component\DependencyInjection\ContainerAwareInterface,
    Symfony\Component\DependencyInjection\ContainerInterface,
    Symfony\Component\Security\Core\User\UserInterface;

use Farma\UserBundle\Entity\User,
    Farma\UserBundle\Model\UserRole;

class LoadData extends AbstractFixture implements OrderedFixtureInterface, ContainerAwareInterface
{
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $entityManager)
    {
        $superAdmin = $this->createUser('superadmin', array(UserRole::SUPER_ADMIN));
        $entityManager->persist($superAdmin);

        $admin = $this->createUser('admin', array(UserRole::ADMIN));
        $entityManager->persist($admin);

        $seller = $this->createUser('vendedor', array(UserRole::SALES));
        $entityManager->persist($seller);

        $grocer = $this->createUser('bodeguero', array(UserRole::INVENTORY));
        $entityManager->persist($grocer);

        $entityManager->flush();
    }

    private function createUser($username, array $roles = array())
    {
        $user = new User();
        $user->setRoles($roles);
        $user->setEmail($username.'@farma.com');
        $user->setFullName(ucfirst($username).' Farma');

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
