<?php

namespace Farma\BaseBundle\Tests\Utils;

use Doctrine\Common\DataFixtures\Executor\ORMExecutor,
    Doctrine\Common\DataFixtures\Purger\ORMPurger,
    Doctrine\ORM\EntityManager;

use Symfony\Bridge\Doctrine\DataFixtures\ContainerAwareLoader as DataFixturesLoader,
    Symfony\Component\DependencyInjection\Container,
    Symfony\Component\DependencyInjection\ContainerAwareInterface;

class FixtureLoader
{
    public function load(array $fixtures, Container $container)
    {
        foreach ($fixtures as $fixture) {
            if ($fixture instanceof ContainerAwareInterface) {
                $fixture->setContainer($container);
            }
        }

        $entityManager = $container->get('doctrine.orm.entity_manager');
        $purger        = new ORMPurger($entityManager);
        $purger->setPurgeMode(ORMPurger::PURGE_MODE_DELETE);
        $executor      = new ORMExecutor($entityManager, $purger);

        $executor->execute($fixtures);
    }
}