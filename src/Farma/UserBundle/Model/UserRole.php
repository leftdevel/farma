<?php

namespace Farma\UserBundle\Model;

class UserRole
{
    const USER = 'ROLE_USER';
    const INVENTORY = 'ROLE_INVENTORY';
    const SALES = 'ROLE_SALES';
    const ADMIN = 'ROLE_ADMIN';
    const SUPER_ADMIN = 'ROLE_SUPER_ADMIN';

    public static function getRoles()
    {
        return array(
            self::USER,
            self::INVENTORY,
            self::SALES,
            self::ADMIN,
            self::SUPER_ADMIN
        );
    }
}