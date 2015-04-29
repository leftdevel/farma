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

    public static function getRolesWeightsMap()
    {
        return array(
            self::USER             => 0,
            self::INVENTORY      => 100,
            self::SALES         => 1000,
            self::ADMIN        => 10000,
            self::SUPER_ADMIN => 100000
        );
    }

    public static function getRolesWeight(array $roles) {
        $weight = 0;
        $weightsMap = self::getRolesWeightsMap();

        foreach ($roles as $rol) {
            $weight += $weightsMap[$rol];
        }

        return $weight;
    }
}