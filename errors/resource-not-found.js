class ResourceNotFoundErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'ResourceNotFound';
  }
}

module.exports = ResourceNotFoundErr;
