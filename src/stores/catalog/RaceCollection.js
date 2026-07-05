import BaseCustomStore from "../bases/BaseCustomStore";
import { raceService } from "../../services/raceService";
import RaceModel from "../../models/RaceModel";

export class RaceCollection extends BaseCustomStore {
  constructor() {
    super(raceService, RaceModel);
  }

  get page() {
    return {
      items: this.items,
      count: this.items.length,
    };
  }

  async loadRaces() {
    return this.loadAll();
  }

  async addRace(payload) {
    return this.create(payload);
  }

  async updateRace(id, payload) {
    return this.update(id, payload);
  }

  async deleteRace(id) {
    return this.delete(id);
  }
}

export const raceCollection = new RaceCollection();
export default raceCollection;
