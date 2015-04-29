<?php

namespace Farma\BaseBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder,
    Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface,
    Symfony\Component\DependencyInjection\Reference;

class EventCompilerPass implements CompilerPassInterface
{
    public function process(ContainerBuilder $container)
    {
        if (!$container->has('base.event.processor')) {
            return;
        }

        $eventProcessor = $container->findDefinition('base.event.processor');
        $taggedServices = $container->findTaggedServiceIds('base.event.listener');

        foreach ($taggedServices as $id => $tags) {
            $eventProcessor->addMethodCall(
                'addListener',
                array(new Reference($id))
            );
        }
    }
}