import { makeAutoObservable } from "mobx";

export class Model {
  constructor(data = {}) {
    Object.assign(this, data);
  }
}

export default Model;
