import BaseCustomStore from "../bases/BaseCustomStore";
import { countryService } from "../../services/countryService";
import CountryModel from "../../models/CountryModel";

export class CountryCollection extends BaseCustomStore {
  constructor() {
    super(countryService, CountryModel);
  }

  get page() {
    return {
      items: this.items,
      count: this.items.length,
    };
  }

  async loadCountries() {
    return this.loadAll();
  }

  async addCountry(payload) {
    return this.create(payload);
  }

  async updateCountry(id, payload) {
    return this.update(id, payload);
  }

  async deleteCountry(id) {
    return this.delete(id);
  }
}

export const countryCollection = new CountryCollection();
export default countryCollection;
