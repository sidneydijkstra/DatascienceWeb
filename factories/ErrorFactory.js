var database = require("../controllers/database/database.js");

// class for creating error object used for error display
class ErrorFactory{
  constructor() {
    // isEmpty
  }

  // function for creating exception error object
  createExceptionError(location, request, error){
    return {
      location: location,
      from: request.originalUrl,
      error: error
    };
  }

  // function for creating validation error object
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
