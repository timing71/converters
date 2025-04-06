import fs from 'fs';

import { generateEvents } from '../convert.js';
import { PitInEvent } from '../../events.js';

describe('Al Kamel conversion', () => {
  describe('generateEvents', () => {
    it('generates events', async () => {
      const analysis = fs.createReadStream(
        'src/alkamel/__tests__/analysis.csv',
        { highWaterMark: 8192 } // Deliberately small to force handling multiple chunks)
      );
      const events = await generateEvents(analysis, '2025-04-05', 1800);

      const pitInEvents = events.filter(e => e instanceof PitInEvent);
      expect(pitInEvents.length).toEqual(3);

      expect(events.length).toEqual(0);
    });
  });
});
