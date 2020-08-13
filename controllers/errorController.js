module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.send({
      errorMsg: err.message,
      error: err,
    });
  } else if (process.env.NODE_ENV == "production") {
    let statusCode = err.statusCode || 500;
    let status = `${err.statusCode}`.startsWith("4") ? 400 : 500;
    res.status(statusCode).send({
      status,
      errorMessage: err.message,
    });
  }
};
