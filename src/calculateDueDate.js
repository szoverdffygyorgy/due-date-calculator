"use strict";

module.exports = function createCalculator(deps) {
	deps = deps || {};

	["start", "end", "hours"].forEach(prop => {
		if (!deps.hasOwnProperty(prop)) {
			throw new Error(`${prop} is a mandatory dependency.`)
		}
	});

	const dayStart = deps.start;
	const dayEnd = deps.end;
	const numOfHours = deps.hours;

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
		if (submit.hour + turnaround.hours >= dayEnd && submit.minute > 0) {
			turnaround.days++;
		}

		if (submit.dayNum + turnaround.days > 5) {
			turnaround.days += 2;
		}

		turnaround.hours = (turnaround.hours + submit.hour - dayStart) % numOfHours;
	}

	function calculateDueDate(submissionDate, turnaround) {
		if (!(submissionDate instanceof Date) && isNaN(submissionDate)) {
			throw new Error("Please provide a valid submission date.");
		}

		if (submissionDate.getDay() === 6 || submissionDate.getDay() === 0 || submissionDate.getHours() < dayStart || submissionDate.getHours() > dayEnd) {
			throw new Error("Submission date should be on weekdays during working hours.");
		}

		if (typeof turnaround !== "number") {
			throw new Error("turnaround should be a number.");
		}

		const submitDate = getDateParts(submissionDate);
		const dueDate = submissionDate;

		if (turnaround + submitDate.hour < dayEnd) {
			dueDate.setHours(submitDate.hour + turnaround);
			return dueDate;
		}

		const turnAroundTimes = {
			days: Math.floor(turnaround / numOfHours),
			hours: turnaround % numOfHours
		};

		checkOverlap(submitDate, turnAroundTimes);

		dueDate.setDate(submitDate.day + turnAroundTimes.days);
		dueDate.setHours(dayStart + turnAroundTimes.hours);

		return dueDate;
	}

	return calculateDueDate;
}