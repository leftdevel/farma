<?php

namespace Farma\InventoryBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture,
    Doctrine\Common\DataFixtures\OrderedFixtureInterface,
    Doctrine\Common\Persistence\ObjectManager;

use Symfony\Component\DependencyInjection\ContainerAwareInterface,
    Symfony\Component\DependencyInjection\ContainerInterface;

use Farma\InventoryBundle\Entity\Medicine;

class LoadMedicineData extends AbstractFixture implements OrderedFixtureInterface, ContainerAwareInterface
{
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $entityManager)
    {
        // ALEVE
        $aleve = new Medicine();
        $aleve->setName('Aleve');
        $aleve->setGeneric('naproxeno');
        $aleve->setPresentation('tableta');

        $aleve->setLaboratory('BAYERN');
        $aleve->setConcentration('100 mg');
        $aleve->addQuantity(100);
        $aleve->setPrice(5000);
        $aleve->setCost(3000);

        $expiry = new \DateTime('now -30 days');
        $timestamp = $expiry->getTimestamp();
        $aleve->setExpiryFirst($timestamp);
        $aleve->setExpiryLast($timestamp);

        // DORIVAL
        $dorival = new Medicine();
        $dorival->setName('Dorival');
        $dorival->setGeneric('ibuprofeno');
        $dorival->setPresentation('tableta');

        $dorival->setLaboratory('Fontana S.A.');
        $dorival->setConcentration('200 mg');
        $dorival->addQuantity(80);
        $dorival->setPrice(2000);
        $dorival->setCost(1000);

        $expiry = new \DateTime('now +20 days');
        $timestamp = $expiry->getTimestamp();
        $dorival->setExpiryFirst($timestamp);
        $dorival->setExpiryLast($timestamp);

        // VENTOLIN

        // spray
        $ventolin1 = new Medicine();
        $ventolin1->setName('Ventolin');
        $ventolin1->setGeneric('salbutamol');
        $ventolin1->setPresentation('spray');

        $ventolin1->setLaboratory('rarpe');
        $ventolin1->setConcentration('100 mcg');
        $ventolin1->addQuantity(50);
        $ventolin1->setPrice(2100);
        $ventolin1->setCost(800);

        $expiry = new \DateTime('now +28 days');
        $timestamp = $expiry->getTimestamp();
        $ventolin1->setExpiryFirst($timestamp);
        $ventolin1->setExpiryLast($timestamp);

        // gotero
        $ventolin2 = new Medicine();
        $ventolin2->setName('Ventolin');
        $ventolin2->setGeneric('salbutamol');
        $ventolin2->setPresentation('gotero');

        $ventolin2->setLaboratory('rarpe');
        $ventolin2->setConcentration('10 mL');
        $ventolin2->addQuantity(50);
        $ventolin2->setPrice(2100);
        $ventolin2->setCost(800);

        $expiry = new \DateTime('now +35 days');
        $timestamp = $expiry->getTimestamp();
        $ventolin2->setExpiryFirst($timestamp);
        $ventolin2->setExpiryLast($timestamp);

        // ampolla
        $ventolin3 = new Medicine();
        $ventolin3->setName('Ventolin');
        $ventolin3->setGeneric('salbutamol');
        $ventolin3->setPresentation('ampolla');

        $ventolin3->setLaboratory('rarpe');
        $ventolin3->setConcentration('1 mL');
        $ventolin3->addQuantity(120);
        $ventolin3->setPrice(1000);
        $ventolin3->setCost(200);

        $expiry = new \DateTime('now +1 days');
        $timestamp = $expiry->getTimestamp();
        $ventolin3->setExpiryFirst($timestamp);
        $ventolin3->setExpiryLast($timestamp);

        // BISOLVON
        $bisolvon = new Medicine();
        $bisolvon->setName('Bisolvon');
        $bisolvon->setGeneric('bromhexina');
        $bisolvon->setPresentation('jarabe');

        $bisolvon->setLaboratory('Boehringer');
        $bisolvon->setConcentration('100 ml');
        $bisolvon->addQuantity(60);
        $bisolvon->setPrice(4000);
        $bisolvon->setCost(2500);

        $expiry = new \DateTime('now +7 days');
        $timestamp = $expiry->getTimestamp();
        $bisolvon->setExpiryFirst($timestamp);
        $bisolvon->setExpiryLast($timestamp);

        // DOLOFIN
        $dolofin = new Medicine();
        $dolofin->setName('Dolofín');
        $dolofin->setGeneric('acetaminofén');
        $dolofin->setPresentation('tableta');

        $dolofin->setLaboratory('Laboratorio López');
        $dolofin->setConcentration('200 ml');
        $dolofin->addQuantity(120);
        $dolofin->setPrice(1000);
        $dolofin->setCost(100);

        $expiry = new \DateTime('now +12 days');
        $timestamp = $expiry->getTimestamp();
        $dolofin->setExpiryFirst($timestamp);
        $dolofin->setExpiryLast($timestamp);

        $entityManager->persist($aleve);
        $entityManager->persist($dorival);
        $entityManager->persist($ventolin1);
        $entityManager->persist($ventolin2);
        $entityManager->persist($ventolin3);
        $entityManager->persist($bisolvon);
        $entityManager->persist($dolofin);
        $entityManager->flush();
    }

    public function getOrder()
    {
        return 2;
    }
}
