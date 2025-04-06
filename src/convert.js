export class Converter {

  constructor() {
    this.convert = this.convert.bind(this);
    this.generate = this.generate.bind(this);
  }

  async convert() {

  }

  async generate() {
    throw new Error('Subclass must implement generate()');
  }
}
