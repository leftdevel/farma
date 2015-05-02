<?php

namespace Farma\UserBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture,
    Doctrine\Common\DataFixtures\OrderedFixtureInterface,
    Doctrine\Common\Persistence\ObjectManager;

use Symfony\Component\DependencyInjection\ContainerAwareInterface,
    Symfony\Component\DependencyInjection\ContainerInterface;

use Farma\InventoryBundle\Entity\Medicine;

class LoadMedicineData extends AbstractFixture implements OrderedFixtureInterface, ContainerAwareInterface
{
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $entityManager)
    {
        $aleve = new Medicine();
    }

    public function getOrder()
    {
        return 2;
    }
}
