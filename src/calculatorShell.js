"use strict";

const core = require("./calculateDueDate");

const workday = {
	start: 9,
	end: 17,
	hours: 8
};

module.exports = core(workday);