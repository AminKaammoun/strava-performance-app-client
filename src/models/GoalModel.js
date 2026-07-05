import Model from "./bases/Model";

export class GoalModel extends Model {
  constructor(data = {}) {
    super({
      id: data.id ?? null,
      title: data.title ?? "",
      description: data.description ?? "",
      type: data.type ?? "",
      targetValue: data.targetValue ?? null,
      currentValue: data.currentValue ?? null,
      targetDate: data.targetDate ?? null,
      achieved: Boolean(data.achieved),
      relatedRaceId: data.relatedRaceId ?? null,
      relatedRaceName: data.relatedRaceName ?? "", // convenience, read-only
    });
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      type: this.type,
      targetValue: this.targetValue,
      currentValue: this.currentValue,
      targetDate: this.targetDate,
      achieved: this.achieved,
      relatedRaceId: this.relatedRaceId,
    };
  }
}

export default GoalModel;
