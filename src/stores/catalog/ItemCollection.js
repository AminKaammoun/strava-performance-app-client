import BaseCustomStore from "../bases/BaseCustomStore";
import { itemService } from "../../services/itemService";
import ItemModel from "../../models/ItemModel";

export class ItemCollection extends BaseCustomStore {
  constructor() {
    super(itemService, ItemModel);
  }

  get itemsPage() {
    return {
      items: this.items,
      count: this.items.length,
    };
  }

  async loadItems() {
    return this.loadAll();
  }

  async addItem(payload) {
    return this.create(payload);
  }

  async toggleDone(item) {
    return this.update(item.id, { ...item.toJSON?.(), done: !item.done });
  }

  async deleteItem(id) {
    return this.delete(id);
  }
}

export const itemCollection = new ItemCollection();
export default itemCollection;
