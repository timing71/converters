import { parseStringPromise } from 'xml2js';

export class DecodeError extends Error {};

export class HHTimingConverter {

  _resetState() {
    this.state = {};
  }

  async convert(hhReadableStream) {
    this._resetState();

    let remnant = '';

    for await (const chunk of hhReadableStream) {
      // Do something with each "chunk"
      const thisChunk = remnant + chunk.toString('utf-8');

      const lines = thisChunk.split('\n');
      if (thisChunk.slice(-1) !== '\n') {
        remnant = lines.pop();
      }

      for (const line of lines) {
        if (line.length > 0) {
          const decoded = await decodeLine(line);
          console.log(decoded);
        }
      }
    }
  }
}

export const decodeLine = async (lineText) => {
  const parts = lineText.split('|');

  if (parts.length !== 2) {
    throw new DecodeError(`Line did not contain pipe separator (|): ${lineText}`);
  }

  const timestamp = new Date(parts[0]);

  if (isNaN(timestamp)) {
    throw new DecodeError(`Timestamp '${parts[0]}' was not valid`);
  }

  const xmlData = atob(parts[1]);
  try {
    const data = await parseStringPromise(xmlData, { explicitArray: false });
    return {
      timestamp,
      data
    };
  }
  catch (e) {
    throw new DecodeError(e);
  }
};
