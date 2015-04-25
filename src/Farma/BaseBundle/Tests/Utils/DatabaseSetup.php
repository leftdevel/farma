<?php

namespace Farma\BaseBundle\Tests\Utils;

use Doctrine\Bundle\DoctrineBundle\Command\DropDatabaseDoctrineCommand,
    Doctrine\Bundle\DoctrineBundle\Command\CreateDatabaseDoctrineCommand,
    Doctrine\Bundle\DoctrineBundle\Command\Proxy\UpdateSchemaDoctrineCommand;

use Symfony\Bundle\FrameworkBundle\Console\Application,
    Symfony\Component\Console\Command\Command,
    Symfony\Component\Console\Input\ArrayInput,
    Symfony\Component\Console\Output\StreamOutput;

class DatabaseSetup
{
    private $application;
    private static $kernel;

    public function setup()
    {
        $this->teardown();
        $this->application->add(new CreateDatabaseDoctrineCommand());
        $command = $this->application->find('doctrine:database:create');
        $this->execute($command, array('command' => $command->getName()));
        $this->application->add(new UpdateSchemaDoctrineCommand());
        $command = $this->application->find('doctrine:schema:update');
        $this->execute($command, array('command' => $command->getName(), '--force' => true));
    }

    public function teardown()
    {
        $this->application->add(new DropDatabaseDoctrineCommand());
        $command = $this->application->find('doctrine:database:drop');
        $this->execute($command, array('command' => $command->getName(), '--force' => true));
        $this->resetDatabaseConnection();
    }

    private function execute(Command $command, array $input)
    {
        $input  = new ArrayInput($input);
        $output = new StreamOutput(fopen('php://memory', 'w', false));
        $command->run($input, $output);
        return $output;
    }

    public function getDisplay($output, $normalize = false)
    {
        rewind($output->getStream());

        $display = stream_get_contents($output->getStream());

        if ($normalize) {
            $display = str_replace(PHP_EOL, "\n", $display);
        }

        return $display;
    }

    public function setupApplication(\AppKernel $kernel)
    {
        self::$kernel = $kernel;

        if (!$this->application) {
            $this->application = new Application($kernel);
        }
    }

    private function resetDatabaseConnection()
    {
        $container = self::$kernel->getContainer();
        $em        = $container->get('doctrine.orm.entity_manager');
        $conn      = $em->getConnection();
        $conn->close();
    }
}