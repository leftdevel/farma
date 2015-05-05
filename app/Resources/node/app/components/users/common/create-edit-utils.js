var React = require('react');
var _roles = require('../../../utils/user-utils').getRoles();
var UserStore = require('../../../stores/user-store');
var UserActions = require('../../../actions/user-actions');
var MapValidator = require('../../../lib/validator/map-validator');
var ValidationSchema = require('./validation-schema');

var realm, getState, setState, router;


function getDefaultFields() {
    return {
        full_name: {value: '', error: ''},
        email: {value: '', error: ''},
        role: {value: _roles.ROLE_ADMIN, error: ''}, // One role at a time for current version.
        password: {value: '', error: ''},
        repeat_password: {value: '', error: ''}
    };
}

function bindUserToFields(user, fields) {
    fields.full_name.value = user.full_name;
    fields.email.value = user.email;
    // Roles are fetched as array but we only support one at a time atm.
    fields.role.value = user.roles[0];
}


var CreateEditUtils = {
    getState: null,
    setState: null,
    router: null,

    getCreateInitialState: function() {
        return {
            fields: getDefaultFields()
        };
    },

    getEditInitialState: function(userId) {
        var state = {
            user: null,
            isUpdatePassword: false,
            hasStoreBooted: UserStore.hasBooted(),
            fields: getDefaultFields()
        };

        var user = UserStore.findOneUserById(userId);

        if (user) {
            state.user = user;
            bindUserToFields(user, state.fields);
        }

        return state;
    },

    initialize: function(theRealm, getStateFn, setStateFn, theRouter) {
        realm = theRealm;
        getState = getStateFn;
        setState = setStateFn;
        router = theRouter;
    },

    changeHandler: function(propertyPath, value) {
        var fields = getState().fields;
        fields[propertyPath].value = value;
        setState({fields: fields});
    },

    submitHandler: function() {
        var mapValidator = realm === 'create' ?
            CreateEditUtils._getCreateMapValidator() :
            CreateEditUtils._getEditMapValidator()
        ;

        mapValidator.validateAll();

        if (mapValidator.hasErrors) {
            CreateEditUtils._setFormErrors(mapValidator.errors);
            return;
        }

        var entity = realm === 'create' ?
            CreateEditUtils._getCreateFormEntity() :
            CreateEditUtils._getEditFormEntity()
        ;

        if (realm === 'create') {
            UserActions.createUser(entity);
        } else {
            UserActions.updateUser(entity);
        }

        router.transitionTo('users');
    },

    _setFormErrors: function(errors) {
        var fields = getState().fields;

        for (var i in errors) {
            var error = errors[i];
            fields[error.propertyPath].error = error.errorMessage;
        }

        setState({fields: fields});
    },

    // CREATE

    _getCreateMapValidator: function() {
        var mapValidator = new MapValidator();
        var fields = getState().fields;

        mapValidator
            .addValidatorForPath('full_name', ValidationSchema.getFullNameValidator(fields.full_name.value))
            .addValidatorForPath('email', ValidationSchema.getEmailValidator(fields.email.value))
            .addValidatorForPath('password', ValidationSchema.getPasswordValidator(fields.password.value))
            .addValidatorForPath('repeat_password',
                ValidationSchema.getRepeatPasswordValidator(fields.repeat_password.value, fields.password.value))
        ;

        return mapValidator;
    },

    _getCreateFormEntity: function() {
        var fields = getState().fields;
        var entity = {};

        entity.full_name = fields.full_name.value;
        entity.email = fields.email.value;
        entity.roles = [fields.role.value]; // Backend API expects array
        entity.password = fields.password.value;

        return entity;
    },

    // EDIT

    _getEditMapValidator: function() {
        var mapValidator = new MapValidator();
        var fields = getState().fields;
        var userId = getState().user.id;

        mapValidator
            .addValidatorForPath('full_name', ValidationSchema.getFullNameValidator(fields.full_name.value))
            .addValidatorForPath('email', ValidationSchema.getEditableEmailValidator(fields.email.value, userId))
        ;

        if (getState().isUpdatePassword) {
            mapValidator
                .addValidatorForPath('password', ValidationSchema.getPasswordValidator(fields.password.value))
                .addValidatorForPath('repeat_password',
                    ValidationSchema.getRepeatPasswordValidator(fields.repeat_password.value, fields.password.value))
            ;
        }

        return mapValidator;
    },

    _getEditFormEntity: function() {
        var fields = getState().fields;
        var entity = {};

        entity.id = getState().user.id;
        entity.full_name = fields.full_name.value;
        entity.email = fields.email.value;
        entity.roles = [fields.role.value]; // Backend API expects array

        if (getState().isUpdatePassword) {
            entity.password = fields.password.value;
        }

        return entity;
    }
};

module.exports = CreateEditUtils;
