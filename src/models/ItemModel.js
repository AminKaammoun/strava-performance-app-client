import Model from "./bases/Model";

export class ItemModel extends Model {
  constructor(data = {}) {
    super({
      id: data.id ?? null,
      name: data.name ?? "",
      description: data.description ?? "",
      done: Boolean(data.done),
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      done: this.done,
    };
  }
}

export default ItemModel;
