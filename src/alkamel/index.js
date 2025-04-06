import { Converter } from '../convert.js';
import { generateEvents } from './convert.js';

export class AlKamelConverter extends Converter {
  constructor() {
    super();
    this.setAnalysisFile = this.setAnalysisFile.bind(this);
    this.setStartDate = this.setStartDate.bind(this);
    this.setDurationInSeconds = this.setDurationInSeconds.bind(this);
  }

  setAnalysisFile(analysisFile) {
    this.analysisFile = analysisFile;
  }

  setStartDate(startDate) {
    this.startDate = startDate;
  }

  setDurationInSeconds(duration) {
    this.duration = duration;
  }

  async generate() {
    return await generateEvents(this.analysisFile, this.startDate, this.duration);
  }
}
