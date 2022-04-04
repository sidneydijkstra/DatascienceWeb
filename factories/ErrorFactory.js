var database = require("../controllers/database/database.js");

class ErrorFactory{
  constructor() {
    // isEmpty
  }

  createExceptionError(location, request, error){
    return {
      location: location,
      from: request.originalUrl,
      error: error
    };
  }

  createValidationError(location, request, field, error){
    return {
      location: location,
      from: request.baseUrl,
      field: field,
      error: error
    };
  }
}

var ef = new ErrorFactory();

module.exports = ef;
