<?php

namespace Farma\BaseBundle\Util;

class TimestampValidator
{
    public static function isValid($timestamp)
    {
        return strlen($timestamp) >= 10
            && is_numeric($timestamp)
            && ($timestamp <= PHP_INT_MAX)
            && ($timestamp >= ~PHP_INT_MAX)
        ;
    }
}
