import { parse } from 'csv-parse';

import { FlagEvent, LaptimeEvent, PitInEvent, PitOutEvent } from '../events.js';

export const parseTime = (raw) => {
  if (!raw) {
    return null;
  }
  if (raw.match(/^[0-9]+(\.[0-9]+)?$/)) {
    return parseFloat(raw);
  }
  if (raw.match(/^[0-9]+:[0-9]+(\.[0-9]+)?$/)) {
    const [mins, secs] = raw.split(':');
    return (60 * parseInt(mins, 10)) + parseFloat(secs);
  }
  if (raw.match(/^[0-9]+:[0-9]+:[0-9]+(\.[0-9]+)?$/)) {
    const [hours, mins, secs] = raw.split(':');
    return (3600 * parseInt(hours, 10)) + (60 * parseInt(mins, 10)) + parseFloat(secs);
  }
};

const LAP_FLAGS = {
  0: '',
  1: 'pb',
  2: 'sb'
};

export const generateEvents = (analysisFileStream, startDate, duration) => {

  const parseClockTime = (hourString) => Date.parse(`${startDate}T${hourString}`);

  const events = [];

  const flagRecords = [];

  return new Promise(
    (resolve) => {

      const parser = parse({
        columns: (header) => header.map(col => col.trim()),
        delimiter: ';'
      });

      let prevRow = null;
      let prevRaceNum = null;

      analysisFileStream.pipe(parser).on(
        'data', (row) => {
          console.log(row);

          const raceNum = row['NUMBER'];

          const timestamp = parseClockTime(row['HOUR']);

          if (row['FLAG_AT_FL']) {
            flagRecords.push({
              timestamp,
              flag: row['FLAG_AT_FL']
            });
          }

          const laptime = parseTime(row['LAP_TIME']);
          const lapFlag = LAP_FLAGS[row['LAP_IMPROVEMENT']] || '';

          if (!prevRow || prevRow['CROSSING_FINISH_LINE_IN_PIT'] === 'B') {
            const timeInPit = parseTime(row['PIT_TIME']);
            events.push(new PitOutEvent(timestamp - laptime + timeInPit, raceNum));
          }

          // TODO driver change event
          // TODO sector 1 time event
          // TODO sector 2 time event
          // TODO sector 3 time event

          if (row['CROSSING_FINISH_LINE_IN_PIT'] === 'B') {
            events.push(new PitInEvent(timestamp, raceNum));
          }
          else {
            events.push(new LaptimeEvent(timestamp, raceNum, laptime, lapFlag));
          }

          if (!prevRaceNum || prevRaceNum === raceNum) {
            prevRow = row;
          }
          else {
            prevRow = null;
            prevRaceNum = raceNum;
          }

        }
      ).on(
        'end', () => {

          flagRecords.sort((a, b) => a.timestamp - b.timestamp);

          let prevFlag = null;

          for (const f of flagRecords) {
            if (f.flag !== prevFlag) {
              events.push(new FlagEvent(f.timestamp, f.flag));
              prevFlag = f.flag;
            }
          }

          events.sort((a, b) => a.timestamp - b.timestamp);

          resolve(events);
        }
      );
    }
  );

};
