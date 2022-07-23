# crystalid
Create readable, time-based uid's.

This package is very simple, it introduces a unique uid-naming system, which has its main goal in also storing a timestamp that is semi-readable for humans.

ID's follow the pattern `YYWWDSSSSSMMMXXX`:
- Y are the last two digits of the year.
- W is the amount of weeks in the year. If some days of the year are before week 01, they will be named week 00.
- D is the day of the week, 1 for monday through 7 for sunday.
- S is for seconds in the day, it uses the letters `'o, l, z, e, a, s, b, t, x, g` instead of the numbers 0-9 to give a visual distinction from the previous and following sections.
- M is for milliseconds.
- XXX are three unique characters, each one being either 0-9, a-z or A-Z. That means there are 62 possibilities for each character, and 238,328 possible combinations. Each time an ID is created, this increments internally, instead of being chosen at random. That means that 238,328 different ID's can be created within one millisecond for all of them to be guaranteed to be unique within the database.

This approach is different from UUIDs, as it doesn't ensure that the ID is unique among all people who use it, and makes sure instead that it can reasonably assumed that all ID's are unique within the own database, as well as giving them a timestamp value that can easily be identified.

## Installing

To install this package, type `npm install crystalid` into your console.

## Example usage

```js
const { generateId, convertIdToTimestamp } = require('crystalid');

const array1 = [];
for (let i = 0; i < 1000; i++) {

  // generateId accepts one optional parameter that is a timestamp. If none is given, it defaults to Date.now(). It returns a crystal ID.
  const newId = generateId()
  // A crystal ID must be passed to convertIdToTimestamp, and it will return the timestamp associated with that ID.
  const newTimestamp = convertIdToTimestamp(newId)
  array1.push([newId, newTimestamp]);
}
```
