<?php

namespace Farma\InventoryBundle\Model\Product;

interface ProductInterface
{
    public function getName();
    public function getQuantity();
    public function getCost();
    public function getPrice();
    public function addQuantity($quantity);
    public function reduceQuantity($quantity);
}