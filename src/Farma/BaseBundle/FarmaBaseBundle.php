<?php

namespace Farma\BaseBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle,
    Symfony\Component\DependencyInjection\ContainerBuilder;

use Farma\BaseBundle\DependencyInjection\EventCompilerPass;

class FarmaBaseBundle extends Bundle
{
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new EventCompilerPass());
    }
}
