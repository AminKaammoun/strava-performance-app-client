import Model from "./bases/Model";

export class CityModel extends Model {
  constructor(data = {}) {
    super({
      id: data.id ?? null,
      name: data.name ?? "",
      countryId: data.countryId ?? null,
      countryName: data.countryName ?? "", // convenience, read-only from backend
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      countryId: this.countryId,
    };
  }
}

export default CityModel;
