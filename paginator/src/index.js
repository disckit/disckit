// Core functions
const { paginate }  = require("./core/paginate");
const { fromQuery } = require("./core/fromQuery");

// Stateful
const { Paginator } = require("./stateful/Paginator");

module.exports = { paginate, fromQuery, Paginator };
