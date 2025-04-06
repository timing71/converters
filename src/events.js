const clone = obj => JSON.parse(JSON.stringify(obj));

export class Event {
  constructor(timestamp) {
    this.timestamp = timestamp;
    this.apply = this.apply.bind(this);
  }

  apply(state, colSpec) {
    const newState = clone(state);
    return this._apply(newState, colSpec);
  }

  _apply(_state, _colSpec) {
    throw new Error('Subclass must implement _apply');
  }
}

export class FlagEvent extends Event {
  constructor(timestamp, flag) {
    super(timestamp);
    this.flag = flag;
  }

  _apply(state) {
    state.session.flagState = this.flag;
  }
}

class CarEvent extends Event {
  constructor(timestamp, raceNum) {
    super(timestamp);
    this.raceNum = raceNum;
  }

  getCar(state) {
    return state.cars[this.raceNum];
  }

  getField(car, field, colspec) {
    if (colspec.includes(field)) {
      return car[this.colspec.index(field)];
    }
    return null;
  }

  setField(car, field, colspec, value) {
    if (colspec.includes(field)) {
      car[colspec.index(field)] = value;
    }
  }

  updatedState(state, car) {
    state.cars[this.raceNum] = { ...(state.cars[this.raceNum] || {}), ...car };
  }
}

export class LaptimeEvent extends CarEvent {
  constructor(timestamp, raceNum, laptime, flags) {
    super(timestamp, raceNum);
    this.laptime = laptime;
    this.flags = flags;
  }
}

export class PitInEvent extends CarEvent {
  constructor(timestamp, raceNum, incrementLaps = true) {
    super(timestamp, raceNum);
    this.incrementLaps = incrementLaps;
  }
}

export class PitOutEvent extends CarEvent {}
