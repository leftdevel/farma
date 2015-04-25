<?php

namespace Farma\UserBundle\Model;

class UserRole
{
    const ROLE_USER = 'ROLE_USER';
    const ROLE_INVENTORY = 'ROLE_INVENTORY';
    const ROLE_SALES = 'ROLE_SALES';
    const ROLE_ADMIN = 'ROLE_ADMIN';
    const ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN';

    public static function getRoles()
    {
        return array(
            self::ROLE_USER,
            self::ROLE_INVENTORY,
            self::ROLE_SALES,
            self::ROLE_ADMIN,
            self::ROLE_SUPER_ADMIN
        );
    }
}