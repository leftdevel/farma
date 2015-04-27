function ConstraintException(message, name) {
  this.message = message;
  this.name = name || 'ConstraintException';
}

module.exports = ConstraintException;