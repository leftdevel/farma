<?php

namespace Farma\InventoryBundle\Model\Product;

class OutOfStockException extends \Exception
{
    protected $message = "Product out of stock";
}