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

  async addShoe(payload) {
    return this.create(payload);
  }

  async updateShoe(id, payload) {
    return this.update(id, payload);
  }

  async deleteShoe(id) {
    return this.delete(id);
  }
}

export const shoeCollection = new ShoeCollection();
export default shoeCollection;
