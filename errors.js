var errors = module.exports = {};

/**
 * Authentication Errors
 */

errors.auth = {};

errors.auth.NOT_AUTHENTICATED = {
  type:     "auth"
, code:     "0001"
, httpCode: "401"
, name:     "NOT_AUTHENTICATED"
, message:  "You are not authenticated. Please Login."
};
errors[ errors.auth.NOT_AUTHENTICATED.code ] = errors.auth.NOT_AUTHENTICATED;

errors.auth.NOT_ALLOWED = {
  type:     "auth"
, code:     "0002"
, httpCode: "403"
, name:     "NOT_ALLOWED"
, message:  "You are not allowed to use this resource."
};
errors[ errors.auth.NOT_ALLOWED.code ] = errors.auth.NOT_ALLOWED;

errors.auth.UNKNOWN_OAUTH = {
  type:     "auth"
, code:     "0005"
, httpCode: "401"
, name:     "UNKNOWN_OAUTH"
, message:  "There was an unknown error in the oauth process."
};
errors[ errors.auth.UNKNOWN_OAUTH.code ] = errors.auth.UNKNOWN_OAUTH;

errors.auth.INVALID_ACCESS_TOKEN = {
  type:     "auth"
, code:     "0004"
, httpCode: "401"
, name:     "INVALID_ACCESS_TOKEN"
, message:  "Invalid Password. Please try again."
};
errors[ errors.auth.INVALID_ACCESS_TOKEN.code ] = errors.auth.INVALID_ACCESS_TOKEN;

errors.repo = {};
errors.repo.NOT_FOUND = {
  type: 'repo'
, code: '0010'
, httpCode: '404'
, name: 'NOT_FOUND'
, message: 'Could not find specified repository'
};
errors[ errors.repo.NOT_FOUND.code ] = errors.repo.NOT_FOUND;