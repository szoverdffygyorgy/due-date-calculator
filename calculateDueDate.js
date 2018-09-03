"use strict";

for(let i = 1; i <= 40; i++) {
	const dueDate = calculateDueDate(new Date("2012-02-26T13:20:17.297Z"), i);
	console.log(dueDate.toString(), i);
}

module.exports = function createCalculator(deps) {
	["start", "end", "hours"].forEach(prop => {
		if (!deps.hasOwnPropery(prop)) {
			throw new Error(`${prop} is a mandatory dependency.`)
		}
	});

	function getDateParts(date) {
		return {
			year: date.getFullYear(),
			month:  date.getMonth(),
			day: date.getDate(),
			dayNum: date.getDay(),
			hour: date.getHours(),
			minute: date.getMinutes()
		};
	}

	function checkOverlap(submit, turnaround) {
		if (submit.hour + turnaround.hours >= WORKDAY_END && submit.minute > 0) {
			turnaround.days++;
		}

		if (submit.dayNum + turnaround.days > 5) {
			turnaround.days += 2;
		}

		turnaround.hours = (turnaround.hours + submit.hour - WORKDAY_START) % NUM_OF_HOURS;
	}

	function calculateDueDate(submit, turnaround) {
		if (!(submit instanceof Date) && isNaN(submit)) {
			throw new Error("Please provide a valid submit date.");
		}

		if (typeof turnaround !== "number") {
			throw new Error("turnaround should be a number.");
		}

		const submitDate = getDateParts(submit);
		const dueDate = submit;

		if (turnaround + submitDate.hour < WORKDAY_END) {
			dueDate.setHours(submitDate.hour + turnaround);
			return dueDate;
		}

		const turnAroundTimes = {
			days: Math.floor(turnaround / NUM_OF_HOURS),
			hours: turnaround % NUM_OF_HOURS
		};

		checkOverlap(submitDate, turnAroundTimes);

		dueDate.setDate(submitDate.day + turnAroundTimes.days);
		dueDate.setHours(WORKDAY_START + turnAroundTimes.hours);

		return dueDate;
	}

	return calculateDueDate;
}