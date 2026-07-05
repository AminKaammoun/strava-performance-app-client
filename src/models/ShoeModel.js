import Model from "./bases/Model";

export class ShoeModel extends Model {
  constructor(data = {}) {
    super({
      id: data.id ?? null,
      // Synced from Strava — treat as read-only in the UI.
      name: data.name ?? "",
      primary: Boolean(data.primary),
      resourceState: data.resourceState ?? null,
      distanceMeters: data.distanceMeters ?? null,
      // Manual/local-only fields.
      brand: data.brand ?? "",
      type: data.type ?? "",
      purchaseDate: data.purchaseDate ?? null,
      retired: Boolean(data.retired),
      notes: data.notes ?? "",
    });
  }

  // Only the manual fields are meant to be sent back on an edit — the
  // Strava-synced ones are overwritten by the next sync anyway.
  toJSON() {
    return {
      id: this.id,
      brand: this.brand,
      type: this.type,
      purchaseDate: this.purchaseDate,
      retired: this.retired,
      notes: this.notes,
    };
  }
}

export default ShoeModel;
