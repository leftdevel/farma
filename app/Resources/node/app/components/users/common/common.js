module.exports = {
    getDefaultState: function() {
        return {
            fields: {
                full_name: {value: '', error: ''},
                email: {value: '', error: ''},
                role: {value: '', error: ''},
                password: {value: '', error: ''},
                repeat_password: {value: '', error: ''},
            }
        };
    },
};