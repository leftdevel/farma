function MapValidator() {
    this.validationMaps = [];
    this.errors = [];
    this.hasErrors = null;
}

MapValidator.prototype.addValidatorForPath = function(propertyPath, validator) {
    this.validationMaps.push({
        propertyPath: propertyPath,
        validator: validator
    });

    return this;
};

MapValidator.prototype.validateAll = function() {
    this.hasErrors = false;
    this.errors = [];

    this.validationMaps.forEach(function(validationMap) {
      var validator = validationMap.validator;
      var propertyPath = validationMap.propertyPath;

      validator.validate();
      this.errors.push({propertyPath: propertyPath, errorMessage: validator.errorMessage});

      if (!validator.isValid) {
        this.hasErrors = true;
      }
    }.bind(this));
};

module.exports = MapValidator;
