<?php

namespace Farma\BaseBundle\Event;

class EventProcessor
{
    private $listeners;
    private $logs;


    public function __construct()
    {
        $this->listeners = array();
        $this->logs = array();
    }

    public function process(Event $event)
    {
        foreach ($this->listeners as $listener) {
            $listener->execute($event);
        }
    }

    public function addListener(EventListenerInterface $listener)
    {
        $this->listeners[] = $listener;
        $listener->setEventProcessor($this);
    }

    public function addLog($log)
    {
        $this->logs[] = $log;
    }
}