"use strict";

const calculatorCore = require("./calculateDueDate");

const dependencies = {
	start: 9,
	end: 17,
	hours: 8
};

let calculator;
let dueDate;

describe("Due Date Calculator tests", () => {
	describe("Invalid dependencies", () => {
		it("start missing", () => {
			expect(() => {
				calculatorCore();
			}).toThrowError("start is a mandatory dependency.");
		});

		it("end missing", () => {
			expect(() => {
				calculatorCore({
					start: 0
				});
			}).toThrowError("end is a mandatory dependency.");
		});

		it("hours missing", () => {
			expect(() => {
				calculatorCore({
					start: 0,
					end: 0
				});
			}).toThrowError("hours is a mandatory dependency.");
		});
	});

	describe("Valid dependencies", () => {
		calculator = calculatorCore(dependencies);

		it("Non date submissionDate", () => {
			expect(() => {
				calculator("Not a date");
			}).toThrowError("Please provide a valid submission date.");
		});

		it("Invalid submission date", () => {
			expect(() => {
				calculator(new Date("Sun Sept 02 2018 14:20:17 GMT+0100 (CET)"));
			}).toThrowError("Submission date should be on weekdays during working hours.");

			expect(() => {
				calculator(new Date("Sat Sept 01 2018 14:20:17 GMT+0100 (CET)"));
			}).toThrowError("Submission date should be on weekdays during working hours.");

			expect(() => {
				calculator(new Date("Mon Sept 03 2018 17:20:17 GMT+0100 (CET)"));
			}).toThrowError("Submission date should be on weekdays during working hours.");

			expect(() => {
				calculator(new Date("Mon Sept 03 2018 04:20:17 GMT+0100 (CET)"));
			}).toThrowError("Submission date should be on weekdays during working hours.");
		});

		it("Invalid turnaround value", () => {
			expect(() => {
				calculator(new Date("Mon Sept 03 2018 14:20:17 GMT+0100 (CET)"), "Not a number");
			}).toThrowError("turnaround should be a number.");

			expect(() => {
				calculator(new Date("Mon Sept 03 2018 14:20:17 GMT+0100 (CET)"), -1);
			}).toThrowError("turnaround should be a number.");
		});

		it("No overlapping at all", () => {
			dueDate = calculator(new Date("Fri Mar 02 2012 14:20:17 GMT+0100 (CET)"), 2);

			expect(dueDate.toString()).toBe(new Date("Fri Mar 02 2012 16:20:17 GMT+0100 (CET)").toString());
		});

		it("Overlapping to the next day in the same week", () => {
			dueDate = calculator(new Date("Mon Sept 03 2018 14:20:17 GMT+0100 (CET)"), 7);

			expect(dueDate.toString()).toBe(new Date("Mon Sept 04 2018 13:20:17 GMT+0100 (CET)").toString());
		});

		it("Overlapping to the next week", () => {
			dueDate = calculator(new Date("Thu Sept 06 2018 14:20:17 GMT+0100 (CET)"), 19);

			expect(dueDate.toString()).toBe(new Date("Tue Sept 11 2018 9:20:17 GMT+0100 (CET)").toString());
		});

		it("Overlapping to the next month and week", () => {
			dueDate = calculator(new Date("Fri Aug 31 2018 14:20:17 GMT+0100 (CET)"), 12);

			expect(dueDate.toString()).toBe(new Date("Tue Sept 04 2018 10:20:17 GMT+0100 (CET)").toString());
		});

		it("Overlapping to the next year and week", () => {
			dueDate = calculator(new Date("Fri Dec 28 2018 14:20:17 GMT+0100 (CET)"), 14);

			expect(dueDate.toString()).toBe(new Date("Tue Jan 01 2019 12:20:17 GMT+0100 (CET)").toString());
		});

		it("Overlapping in february during leap year", () => {
			dueDate = calculator(new Date("Tue Febr 28 2012 14:20:17 GMT+0100 (CET)"), 11);

			expect(dueDate.toString()).toBe(new Date("Thu Mar 01 2012 09:20:17 GMT+0100 (CET)").toString());
		});
	});
});