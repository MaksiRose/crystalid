const globalCountLib = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
let globalCount = globalCountLib[0] + globalCountLib[0] + globalCountLib[0];

const numberToLetter = ['o', 'l', 'z', 'e', 'a', 's', 'b', 't', 'x', 'g'];


/**
 * Generates a 16 digit crystal ID
 * @param timestamp - The timestamp associated with this crystal ID
 * @returns The 16 digit crystal ID
 */
export function generateId(timestamp = Date.now()): string {

	const date1 = new Date(timestamp);
	const year = date1.getUTCFullYear().toString().slice(-2);
	const week = ('0' + getWeek(date1).toString()).slice(-2);
	const weekday = (date1.getUTCDay() || 7).toString();
	const secondsString = getSecondsInDayAsLetters(date1);
	const milliseconds = ('00' + date1.getUTCMilliseconds().toString()).slice(-3);
	const extraCount = getGlobalCount().toString();

	return year + week + weekday + secondsString + milliseconds + extraCount;
}

/**
 * Takes a 16 digit crystal ID and returns the timestamp associated with that ID
 * @param string A 16 digit crystal ID
 * @returns A timestamp associated with the given crystal ID
 */
export function convertIdToTimestamp(string: string): number {

	const year = Number('20' + string.substring(0, 2));
	const week = Number(string.substring(2, 4));
	const weekday = Number(string.substring(4, 5));

	const date1 = getDateFromWeek(year, week, weekday);

	const secondsInDay = getSecondsInDayFromLetters(string.substring(5, 10));
	const hours = Math.floor(secondsInDay / 60 / 60);
	const minutes = Math.floor(secondsInDay / 60) * (hours * 60);
	const seconds = secondsInDay - (hours * 60 * 60) - (minutes * 60);
	const milliseconds = Number(string.substring(10, 13));

	date1.setUTCHours(hours);
	date1.setUTCMinutes(minutes);
	date1.setUTCSeconds(seconds);
	date1.setUTCMilliseconds(milliseconds);

	return date1.getTime();
}

function getWeek(date1: Date): number {

	// date of first day of the year
	const yearStart = new Date(Date.UTC(date1.getUTCFullYear(), 0, 1));
	// weekday of yearStart
	const yearStartDayNum = yearStart.getUTCDay() || 7;
	// first date with weekday = 1 of the year
	const firstWeekStart = new Date(Date.UTC(date1.getUTCFullYear(), 0, yearStartDayNum === 1 ? 1 : 9 - yearStartDayNum));
	// difference between today and firstWeekStart in days, rounded up
	const daysSinceFirstWeek = Math.ceil((date1.getTime() - firstWeekStart.getTime()) / 86_400_000);
	// divide by 7, round down, add 1 (this ensures that the first day of the week is also included)
	return Math.floor(daysSinceFirstWeek / 7) + 1;
}

function getDateFromWeek(year: number, week: number, weekday: number): Date {

	// date of first day of the year
	const yearStart = new Date(Date.UTC(year, 0, 1));
	// weekday of yearStart
	const yearStartDayNum = yearStart.getUTCDay() || 7;
	// first date with weekday = 1 of the year
	const firstWeekStart = new Date(Date.UTC(year, 0, yearStartDayNum === 1 ? 1 : 9 - yearStartDayNum));
	// multiplying the weeks gets the monday of the next week, minus the difference in days
	const daysSinceFirstWeek = (week * 7) - (8 - weekday);
	const millisecondsSinceFirstWeek = daysSinceFirstWeek * 86_400_000;
	return new Date(millisecondsSinceFirstWeek + firstWeekStart.getTime());
}

function getSecondsInDayAsLetters(date1: Date): string {

	const seconds = date1.getUTCSeconds() + (60 * date1.getUTCMinutes()) + (60 * 60 * date1.getUTCHours());
	const secondsNumberString = ('0000' + seconds.toString()).slice(-5);
	return function(str: string) {
		let newStr = '';
		for (let i = 0; i < str.length; i++) {
			newStr += numberToLetter[Number(str[i])];
		}
		return newStr;
	}(secondsNumberString);
}

function getSecondsInDayFromLetters(string: string): number {

	const secondsNumberString = function(str: string) {
		let newStr = '';
		for (let i = 0; i < str.length; i++) {
			newStr += String(numberToLetter.findIndex(el => el === str[i]));
		}
		return newStr;
	}(string);

	return Number(secondsNumberString);
}

function getGlobalCount(): string {

	const currentGlobalCount = globalCount;

	const thirdCharIndex = globalCountLib.findIndex(el => el === globalCount[2]);
	if (globalCountLib[thirdCharIndex + 1] === undefined) {

		const secondCharIndex = globalCountLib.findIndex(el => el === globalCount[1]);
		if (globalCountLib[secondCharIndex + 1] === undefined) {

			const firstCharIndex = globalCountLib.findIndex(el => el === globalCount[0]);
			if (globalCountLib[firstCharIndex + 1] === undefined) {

				globalCount = globalCountLib[0] + globalCountLib[0] + globalCountLib[0];
			}
			else { globalCount = globalCountLib[firstCharIndex + 1] + globalCountLib[0] + globalCountLib[0]; }
		}
		else {

			globalCount = globalCount[0] + globalCountLib[secondCharIndex + 1] + globalCountLib[0];
		}
	}
	else { globalCount = globalCount[0] + globalCount[1] + globalCountLib[thirdCharIndex + 1]; }

	return currentGlobalCount;
}