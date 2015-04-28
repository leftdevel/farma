var assign = require('object-assign');
var UserActions = require('../../../actions/user-actions');
var Validation = require('./validation');

module.exports = {
    clearAndFinish: function(context) {
        context.refs.FullName.clearValue();
        context.refs.Email.clearValue();
        context.refs.Password.clearValue();
        context.refs.RepeatPassword.clearValue();

        context.setDefaultState();
        context.props.finishHandler();
    },

    submit: function(context) {
        var form = {
            full_name: context.refs.FullName.getValue(),
            email: context.refs.Email.getValue(),
            password: context.refs.Password.getValue(),
            repeat_password: context.refs.RepeatPassword.getValue(),
            flat_roles: context.refs.Role.getValue()
        };

        var mapValidator = Validation.validate(form);

        if (mapValidator.hasErrors) {
            var errors = context.state.errors;
            errors = assign({}, errors, mapValidator.errors);
            context.setState({errors: errors});

            return false;
        }

        UserActions.createUser(form);
        this.clearAndFinish(context);
    }
};