<?php

namespace Farma\UserBundle\Event;

use Symfony\Component\Security\Core\SecurityContextInterface;

use Farma\BaseBundle\Event\Event,
    Farma\BaseBundle\Event\BaseEventListener,
    Farma\UserBundle\Api\UserApi,
    Farma\UserBundle\Entity\User,
    Farma\UserBundle\Model\UserRole;


// @TODO move this class to a socket notification bundle
class RolesUpdatedListener extends BaseEventListener
{
    public function execute(Event $event)
    {
        if ($event->getName() !== UserApi::USER_UPDATED) {
            return;
        }

        $data = $event->getData();
        $updatedUser = $data['updated_user'];
        $originalUser = $data['original_user'];

        $originalRolesWeight = UserRole::getRolesWeight($originalUser->getRoles());
        $updatedRolesWeight = UserRole::getRolesWeight($updatedUser->getRoles());

        if ($updatedRolesWeight < $originalRolesWeight) {
            // @TODO send socket notification in order to logout.
        }
    }
}