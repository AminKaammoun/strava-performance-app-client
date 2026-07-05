import Model from "./bases/Model";

export class ShoeModel extends Model {
  constructor(data = {}) {
    super({
      id: data.id ?? null,
      name: data.name ?? "",
      brand: data.brand ?? "",
      type: data.type ?? "",
      purchaseDate: data.purchaseDate ?? null,
      retired: Boolean(data.retired),
      totalDistanceKm: data.totalDistanceKm ?? 0,
      notes: data.notes ?? "",
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      brand: this.brand,
      type: this.type,
      purchaseDate: this.purchaseDate,
      retired: this.retired,
      totalDistanceKm: this.totalDistanceKm,
      notes: this.notes,
    };
  }
}

export default ShoeModel;
