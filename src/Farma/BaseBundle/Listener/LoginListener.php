<?php

namespace Farma\BaseBundle\Listener;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface,
    Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface,
    Symfony\Component\Security\Core\Authentication\Token\TokenInterface,
    Symfony\Component\Security\Core\SecurityContext,
    Symfony\Component\HttpFoundation\Request,
    Symfony\Component\HttpFoundation\RedirectResponse;


class LoginListener implements AuthenticationSuccessHandlerInterface
{
    private $router;
    private $security;

    public function __construct(UrlGeneratorInterface $router, SecurityContext $security) {
        $this->router = $router;
        $this->security = $security;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        $user = $token->getUser();
        $response = new RedirectResponse($this->router->generate('base_index'));

        // $response->setTargetUrl($this->router->generate('user_dashboard'));

        return $response;
    }
}