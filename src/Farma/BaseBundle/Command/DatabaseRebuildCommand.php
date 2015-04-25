<?php

namespace Farma\BaseBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\OutputInterface;
use Doctrine\Bundle\DoctrineBundle\Command\DropDatabaseDoctrineCommand;
use Doctrine\Bundle\DoctrineBundle\Command\CreateDatabaseDoctrineCommand;
use Doctrine\Bundle\DoctrineBundle\Command\Proxy\CreateSchemaDoctrineCommand;
use Doctrine\Bundle\FixturesBundle\Command\LoadDataFixturesDoctrineCommand;

class DatabaseRebuildCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('db:rebuild');
        $this->setDescription('Rebuild the database with test fixtures');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $curentEnvironment      = $this->getApplication()->getKernel()->getEnvironment();
        $allowedEnvironments    = array('dev', 'staging');

        if (in_array($curentEnvironment, $allowedEnvironments, true)) {
            try {
                $this->dropDatabase($input, $output);
                $this->resetDatabaseConnection();
                $this->createDatabase($input, $output);
                $this->resetDatabaseConnection();
                $this->createTables($input, $output);
                $this->resetDatabaseConnection();
                $this->populateDataFixtures($input, $output);
            }
            catch (\Exception $e) {
                die('Error: ' . $e);
            }
        } else {
            throw new \Exception(sprintf('Can only run in environments %s', join(', ', $allowedEnvironments)));
        }
    }

    private function dropDatabase(InputInterface $input, OutputInterface $output)
    {
        $dropInput      = new ArrayInput(array('doctrine:database:drop', '--force' => true));
        $dropCommand    = new DropDatabaseDoctrineCommand();

        $dropCommand->setApplication($this->getApplication());
        $dropCommand->run($dropInput, $output);
    }

    private function createDatabase(InputInterface $input, OutputInterface $output)
    {
        $createInput    = new ArrayInput(array('doctrine:database:create'));
        $createCommand  = new CreateDatabaseDoctrineCommand();

        $createCommand->setApplication($this->getApplication());
        $createCommand->run($createInput, $output);
    }

    private function createTables(InputInterface $input, OutputInterface $output)
    {
        $createInput    = new ArrayInput(array('doctrine:schema:create'));
        $createCommand  = new CreateSchemaDoctrineCommand();

        $createCommand->setApplication($this->getApplication());
        $createCommand->run($createInput, $output);
    }

    private function populateDataFixtures(InputInterface $input, OutputInterface $output)
    {
        $loadInput      = new ArrayInput(array('doctrine:fixtures:load'));
        $loadInput->setInteractive(false);
        $loadCommand    = new LoadDataFixturesDoctrineCommand();

        $loadCommand->setApplication($this->getApplication());
        $loadCommand->run($loadInput, $output);
    }

    protected function resetDatabaseConnection()
    {
        $container  = $this->getApplication()->getKernel()->getContainer();
        $em         = $container->get('doctrine.orm.entity_manager');
        $conn       = $em->getConnection();

        $conn->close();
    }
}