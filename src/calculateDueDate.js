"use strict";

module.exports = function createCalculator(deps) {
	deps = deps || {};

	["start", "end"].forEach(prop => {
		if (!deps.hasOwnProperty(prop)) {
			throw new Error(`${prop} is a mandatory dependency.`)
		}
	});

	const dayStart = deps.start;
	const dayEnd = deps.end;
	const numOfHours = dayEnd - dayStart;

	function getDateComponents(date) {
		return {
			year: date.getFullYear(),
			month:  date.getMonth(),
			day: date.getDate(),
			dayNum: date.getDay(),
			hour: date.getHours(),
			minute: date.getMinutes()
		};
	}

	function validateSubmissionDate(date) {
		if (date.getDay() === 6) {
			return false;
		}

		if (date.getDay() === 0) {
			return false;
		}

		if (date.getHours() < dayStart) {
			return false;
		}

		if (date.getHours() >= dayEnd) {
			return false;
		}

		return true;
	}

	function getDayOverlap(submission, turnaround) {
		let days = turnaround.days;
		
		if (submission.hour + turnaround.hours >= dayEnd && submission.minute > 0) {
			days++;
		}

		if (submission.dayNum + turnaround.days > 5) {
			days += 2;
		}

		return days;
	}
	
	function calculateDueDate(submissionDate, turnaround) {
		if (!(submissionDate instanceof Date) && isNaN(submissionDate)) {
			throw new Error("Please provide a valid submission date.");
		}
		
		if (!validateSubmissionDate(submissionDate)) {
			throw new Error("Submission date should be on weekdays during working hours.");
		}
		
		if (typeof turnaround !== "number" || turnaround < 0) {
			throw new Error("turnaround should be a number.");
		}
		
		const submissionComponents = getDateComponents(submissionDate);
		const dueDate = submissionDate;
		
		if (turnaround + submissionComponents.hour < dayEnd) {
			dueDate.setHours(submissionComponents.hour + turnaround);
			return dueDate;
		}
		
		const turnAroundTimes = {
			days: Math.floor(turnaround / numOfHours),
			hours: turnaround % numOfHours
		};
		
		turnAroundTimes.days = getDayOverlap(submissionComponents, turnAroundTimes);
		turnAroundTimes.hours = (turnAroundTimes.hours + submissionComponents.hour - dayStart) % numOfHours;
		
		dueDate.setDate(submissionComponents.day + turnAroundTimes.days);
		dueDate.setHours(dayStart + turnAroundTimes.hours);
		
		return dueDate;
	}
	
	return calculateDueDate;
};
