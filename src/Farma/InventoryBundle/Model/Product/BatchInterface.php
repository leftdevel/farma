<?php

namespace Farma\InventoryBundle\Model\Product;

interface BatchInterface
{
    public function getCost();
    public function getQuantity();
    public function getCreated();
}