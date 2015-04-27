function Constraint(errorMessage, check) {
  this.errorMessage = errorMessage;
  this.check = check;
}

Constraint.prototype.validate = function(value) {
  return this.check(value);
};

module.exports = Constraint;