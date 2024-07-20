exports.getClientId = (req, res, next) => {
  req.clientId =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress.split(", ")[0];
  next();
};
