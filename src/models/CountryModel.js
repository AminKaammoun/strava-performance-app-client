import Model from "./bases/Model";

export class CountryModel extends Model {
  constructor(data = {}) {
    super({
      id: data.id ?? null,
      name: data.name ?? "",
      isoCode: data.isoCode ?? "",
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      isoCode: this.isoCode,
    };
  }
}

export default CountryModel;
