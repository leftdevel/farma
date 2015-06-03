<?php

namespace Farma\BaseBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\Persistence\ObjectManager;

class LoadData extends AbstractFixture implements OrderedFixtureInterface
{
    public function load(ObjectManager $manager)
    {
        $conn = $manager->getConnection();
        $query = file_get_contents(__DIR__.'/sessions.mysql.sql');
        $conn->executeQuery($query);
    }

    public function getOrder()
    {
        return 0;
    }
}
