import Model from "./bases/Model";

export class RaceModel extends Model {
  constructor(data = {}) {
    super({
      id: data.id ?? null,
      name: data.name ?? "",
      raceDate: data.raceDate ?? null,
      distanceKm: data.distanceKm ?? null,
      cityId: data.cityId ?? null,
      cityName: data.cityName ?? "", // convenience, read-only
      countryName: data.countryName ?? "", // convenience, read-only
      shoeId: data.shoeId ?? null,
      shoeName: data.shoeName ?? "", // convenience, read-only
      stravaActivityId: data.stravaActivityId ?? null,
      targetTimeSeconds: data.targetTimeSeconds ?? null,
      actualTimeSeconds: data.actualTimeSeconds ?? null,
      overallPlacement: data.overallPlacement ?? null,
      categoryPlacement: data.categoryPlacement ?? null,
      bibNumber: data.bibNumber ?? "",
      notes: data.notes ?? "",
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      raceDate: this.raceDate,
      distanceKm: this.distanceKm,
      cityId: this.cityId,
      shoeId: this.shoeId,
      stravaActivityId: this.stravaActivityId,
      targetTimeSeconds: this.targetTimeSeconds,
      actualTimeSeconds: this.actualTimeSeconds,
      overallPlacement: this.overallPlacement,
      categoryPlacement: this.categoryPlacement,
      bibNumber: this.bibNumber,
      notes: this.notes,
    };
  }
}

export default RaceModel;
