<?php

namespace Farma\BaseBundle\Event;

interface EventListenerInterface
{
    public function execute(Event $event);
    public function setEventProcessor(EventProcessor $eventProcessor);
}