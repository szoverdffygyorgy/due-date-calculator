"use strict";

const calculator = require("./src/calculatorShell");

for(let i = 1; i <= 40; i++) {
	const dueDate = calculator(new Date("Fri Feb 24 2012 14:20:17 GMT+0100 (CET)"), i);
	console.log(`If we start now and ${i} hours are enough, it will be done by ${dueDate.toString()}`);
}
