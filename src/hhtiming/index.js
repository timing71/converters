import { parseStringPromise } from 'xml2js';

export class DecodeError extends Error {};

export class HHTimingConverter {
  convert(hhFile) {

  }
}

export const decodeLine = async (lineText) => {
  const parts = lineText.split('|');

  if (parts.length !== 2) {
    throw new DecodeError('Line did not contain pipe separator (|)');
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
