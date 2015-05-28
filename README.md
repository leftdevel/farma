# Farma

A simple inventory and point of sales management system for SMB pharmacy stores.

##### Features
  - Symfony2
  - React JS
  - React Router
  - Flux
  - MaterializeCSS

This is an ongoing work, I'm developing it during my free time.

There are hundreds of small business pharmacies stores where I live. Most of them still embrace "vintage management", in other words: pen + notepad. My goal is to provide a simple yet useful management tool so they can start using it in no time while seeing great benefits in the short term.

I recently bought a Raspberry Pi 2 and I'll be testing how does Symfony2 performs on it. Trying HVVM is in my TODO list too.

##### Showcase
There is not much to showcase at this point, but you may find usefuly browsing the bundle structure. So far it has:

  - BaseBundle. Where base resources are like the main layout, login and logout controllers.
  - UserBundle. Everything related to users in general, entity, repository, roles, etc. AS well as a UserApi class.
  - InventoryBundle. Maybe the most interesting bundle. We got Entities: Medicine and MedicineBatch. Models: ProductInterface, BatchInterface, OutOfStockException. As well as a MedicineApi class.
  - AppBundle. The single point of entry for the actual ReactJS-powered dashboard.

You will find test coverage for most important resources in those bundles.

For the Javascript part, all resources are found in app/Resources/node/ directory. I named it "node" since all is managed within a node environment. You will find a typical Flux dir structure. There are so many things in there, and some of them are still in heavy development, so please look around at your own risk :)

##### TODO
I'm planning to move most of the backend logic to CQRS + event sourcing sooner than later. I already have a simple dashboard for crud operations on Users and Medicines, but still planning the best approach to keep the GUI and UX as simple as possible whithout chopping up functionality.

Since this is a project for local market, I have all the GUI in spanish, though the code is all in english. Once I have most things figured out I'll add INTL support both to the backend and the frontend.

##### Mision.
Once the App is finished, I'll go store by store offering a raspberry pi 2 preinstalled with the app, ready to be used and give back to my community. I may charge only for the cost of the device and ask for a mentos :)
