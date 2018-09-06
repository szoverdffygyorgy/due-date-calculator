"use strict";

const core = require("./calculateDueDate");

const workday = {
	start: 9,
	end: 17
};

module.exports = core(workday);
