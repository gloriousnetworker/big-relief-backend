class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
    }
  }
  
  const handleError = (err, res) => {
    const { statusCode = 500, message = 'Internal server error' } = err;
    res.status(statusCode).json({
      success: false,
      statusCode,
      message
    });
  };
  
  module.exports = {
    ErrorHandler,
    handleError
  };