var React = require('react');
var Router = require('react-router');

var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;

var Header = require('./components/header');
var Modal = require('./components/modal');
var Toast = require('./components/toast')

// User pages
var UsersList = require('./components/users/list');
var UserCreate = require('./components/users/create');
var UserEdit = require('./components/users/edit');

// Inventory - medicine pages
var InventoryMedicinesList = require('./components/inventory/medicines/list');
var InventoryMedicinesCreate = require('./components/inventory/medicines/create');
var InventoryMedicinesView = require('./components/inventory/medicines/view');

var App = React.createClass({
  render: function () {
    return (
      <div>
        <Header />
        <main id="content">
          <RouteHandler />
        </main>
        <Modal />
        <Toast />
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="users" path="users" handler={UsersList} />
    <Route name="users-create" path="users/create" handler={UserCreate} />
    <Route name="users-edit" path="users/:userId/edit" handler={UserEdit} />
    <Route name="inventory-medicines" path="inventory/medicines" handler={InventoryMedicinesList} />
    <Route name="inventory-medicines-create" path="inventory/medicines/create" handler={InventoryMedicinesCreate} />
    <Route name="inventory-medicines-view" path="inventory/medicines/:medicineId" handler={InventoryMedicinesView} />
    <DefaultRoute handler={UsersList}/>
  </Route>
);

module.exports = routes;
