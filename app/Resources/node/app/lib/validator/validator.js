function Validator(value, constraints, isOptional) {
    this.value = value;
    this.constraints = constraints;
    this.isOptional = isOptional;
    this.errorMessage = '';
    this.isValid = null;
}

Validator.prototype.validate = function() {
    this.errorMessage = '';
    this.isValid = null;

    if (this.isOptional && (this.value === '' || this.value === null || this.value === undefined)) {
        this.isValid = true;
        return;
    }

    for (var i in this.constraints) {
        var constraint = this.constraints[i];

        if (!constraint.validate(this.value)) {
            this.errorMessage = constraint.errorMessage;
            this.isValid = false;
            return;
        }
    }

    this.isValid = true;
};

module.exports = Validator;