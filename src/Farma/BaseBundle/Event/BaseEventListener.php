<?php

namespace Farma\BaseBundle\Event;

abstract class BaseEventListener implements EventListenerInterface
{
    protected $eventProcessor;

    public abstract function execute(Event $event);

    public function setEventProcessor(EventProcessor $eventProcessor)
    {
        $this->eventProcessor = $eventProcessor;
    }
}