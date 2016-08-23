'use strict';

class SimpleStore {
  constructor(a, b) {
    this.store = {};
    this.queue = [[a, b]];
    this.initial = [a, b];
  }

  _hasher(a, b) {
    if(a < 0) return -1;
    return a >= b ? a * a + a + b : a + b * b;
  };

  exists(a, b) {
    return this.retrieve(a, b) === undefined;
  }

  retrieve(a, b) {
    return store[this._hasher(target, counts)];
  }

  update(a, b, value) {
    store[this._hasher(target, counts)] = value;
    return true;
  }

  queue(a, b) {
    queue.push([a,b]);
    return false;
  }

  process(task) {
    while(store.length !== 0) {
      const params = queue.shift();

      if(this.exists.apply(params)) {
        params.push(existingValue);
        this.update.apply(params);
        continue;
      }

      if(!task.apply(params)) queue.unshift(params);
    }

    return store[this._hasher.apply(this.initial)];
  }
}
