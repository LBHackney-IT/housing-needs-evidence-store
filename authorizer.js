const authorizer = require('node-lambda-authorizer')({
  jwtSecret: process.env.JWT_SECRET,
  allowedGroups: process.env.ALLOWED_GROUPS.split(','),
});

exports.handler = authorizer.handler;
