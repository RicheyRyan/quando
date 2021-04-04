const { When, Unless, Match } = require("../dist");

/**
 * When examples
 */
console.log("===== When");
const getPermissions = user =>
  When(user.isAdmin, "Access everything")
    .elseWhen(user.isStandard, "Access some things")
    .end("No access");
console.log(getPermissions({ isAdmin: true }));
console.log(getPermissions({ isStandard: true }));
console.log(getPermissions({}));

/**
 * Unless examples
 */
console.log("===== Unless");
const getUserName = user =>
  Unless(user, "Sorry user required").end(() => user.name);
console.log(getUserName());
console.log(getUserName({ name: "Jerry" }));

/**
 * Match examples
 */
console.log("===== Match");
const httpStatus = code =>
  Match(code)
    .where(code => code < 200, "information")
    .where(code => code < 300, "success")
    .where(code => code < 400, "redirect")
    .where(code => code < 500, "client error")
    .where(code => code < 600, "server error")
    .end();

console.log(httpStatus(102));
console.log(httpStatus(200));
console.log(httpStatus(301));
console.log(httpStatus(418));
console.log(httpStatus(508));
