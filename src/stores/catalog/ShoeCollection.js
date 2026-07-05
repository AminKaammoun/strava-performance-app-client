import BaseCustomStore from "../bases/BaseCustomStore";
import { shoeService } from "../../services/shoeService";
import ShoeModel from "../../models/ShoeModel";

export class ShoeCollection extends BaseCustomStore {
  constructor() {
    super(shoeService, ShoeModel);
  }

  get page() {
    return {
      items: this.items,
      count: this.items.length,
    };
  }

  async loadShoe() {
    return this.loadAll();
  }

  // Shoes are owned by Strava sync now — only the manual/local fields
  // (brand, type, purchaseDate, retired, notes) can be edited here.
  async updateShoe(id, payload) {
    return this.update(id, payload);
  }
}

export const shoeCollection = new ShoeCollection();
export default shoeCollection;
