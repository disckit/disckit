"use strict";

// Core functions
const { paginate }        = require("./core/paginate");
const { fromQuery }       = require("./core/fromQuery");
const { cursorPaginate }  = require("./core/cursorPaginate");
const { pages }           = require("./core/pages");

// Stateful
const { Paginator }       = require("./stateful/Paginator");
const { PaginatorStore }  = require("./stateful/PaginatorStore");

module.exports = {
  // Core
  paginate,
  fromQuery,
  cursorPaginate,
  pages,

  // Stateful
  Paginator,
  PaginatorStore,
};
