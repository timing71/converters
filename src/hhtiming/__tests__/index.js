import { DecodeError, decodeLine } from '../index.js';

const VALID_B64_ENCODED_DATA = 'PFBBU1M+DQogIDxJRD5mMGZmMzk4Zi00OWNhLTQ3MzItODA2Ni0wZTY1YzZlMTBlZGQ8L0lEPg0KICA8RFQ+MDIuMDcuMjAyMyAwMjo1MDozOC4wOTY8L0RUPg0KICA8QkI+OTExPC9CQj4NCiAgPElUPjM5ODExPC9JVD4NCiAgPExQPjIzNjwvTFA+DQogIDxTVD5JMTwvU1Q+DQogIDxWRT4yNjIuNzczPC9WRT4NCiAgPERSPjQ8L0RSPg0KPC9QQVNTPg==';

const DECODED_DATA = {
  'PASS': {
    'BB': '911',
    'DR': '4',
    'DT': '02.07.2023 02:50:38.096',
    'ID': 'f0ff398f-49ca-4732-8066-0e65c6e10edd',
    'IT': '39811',
    'LP': '236',
    'ST': 'I1',
    'VE': '262.773',
  }
};

describe('HH Timing', () => {
  describe('#decodeLine', () => {

    it('decodes a line', async () => {
      const source = `2023-07-02 09:38:22.306395|${VALID_B64_ENCODED_DATA}`;
      const decoded = await decodeLine(source);

      expect(decoded.timestamp).toEqual(new Date('2023-07-02 09:38:22.306395'));
      expect(decoded.data).toEqual(DECODED_DATA);
    });

    it('throws exception if no pipe separator is present', async () => {
      expect(decodeLine('no pipe here sir')).rejects.toThrow(DecodeError);
    });

    it('throws exception if the timestamp is junk', async () => {
      expect(decodeLine(`not a timestamp|${VALID_B64_ENCODED_DATA}`)).rejects.toThrow(DecodeError);
    });

    it('throws exception if decoded XML is junk', () => {
      const invalidXML = btoa('<foo><bar></foos>');
      expect(decodeLine(`2023-07-02 09:38:22.306395|${invalidXML}`)).rejects.toThrow(DecodeError);
    });
  });
});
