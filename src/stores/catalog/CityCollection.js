import BaseCustomStore from "../bases/BaseCustomStore";
import { cityService } from "../../services/cityService";
import CityModel from "../../models/CityModel";

export class CityCollection extends BaseCustomStore {
  constructor() {
    super(cityService, CityModel);
  }

  get page() {
    return {
      items: this.items,
      count: this.items.length,
    };
  }

  async loadCities() {
    return this.loadAll();
  }

  async addCity(payload) {
    return this.create(payload);
  }

  async updateCity(id, payload) {
    return this.update(id, payload);
  }

  async deleteCity(id) {
    return this.delete(id);
  }
}

export const cityCollection = new CityCollection();
export default cityCollection;
