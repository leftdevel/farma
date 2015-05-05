var _roles = require('../../../utils/user-utils').getRoles();

function BaseCreateEdit() {}

BaseCreateEdit.prototype.getDefaultFields = function() {
    return {
        full_name: {value: '', error: ''},
        email: {value: '', error: ''},
        role: {value: _roles.ROLE_ADMIN, error: ''}, // One role at a time for current version.
        password: {value: '', error: ''},
        repeat_password: {value: '', error: ''}
    };
};

BaseCreateEdit.prototype.bindUserToFields = function(user, fields) {
    fields.full_name.value = user.full_name;
    fields.email.value = user.email;
    // Roles are fetched as array but we only support one at a time atm.
    fields.role.value = user.roles[0];
};

BaseCreateEdit.prototype.changeHandler = function(propertyPath, value) {
    var fields = this.state.fields;
    fields[propertyPath].value = value;
    this.setState({fields: fields});
};

BaseCreateEdit.prototype.submitHandler = function() {
    var mapValidator = this._getMapValidator();
    mapValidator.validateAll();

    if (mapValidator.hasErrors) {
        this.setFormErrors(mapValidator.errors);
        return;
    }

    this._sendUserAction();
    this.context.router.transitionTo('users');
};

BaseCreateEdit.prototype.setFormErrors = function(errors) {
    var fields = this.state.fields;

    for (var i in errors) {
        var error = errors[i];
        fields[error.propertyPath].error = error.errorMessage;
    }

    this.setState({fields: fields});
};

module.exports = BaseCreateEdit;