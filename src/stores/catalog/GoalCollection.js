import BaseCustomStore from "../bases/BaseCustomStore";
import { goalService } from "../../services/goalService";
import GoalModel from "../../models/GoalModel";

export class GoalCollection extends BaseCustomStore {
  constructor() {
    super(goalService, GoalModel);
  }

  get page() {
    return {
      items: this.items,
      count: this.items.length,
    };
  }

  async loadGoals() {
    return this.loadAll();
  }

  async addGoal(payload) {
    return this.create(payload);
  }

  async updateGoal(id, payload) {
    return this.update(id, payload);
  }

  async deleteGoal(id) {
    return this.delete(id);
  }
}

export const goalCollection = new GoalCollection();
export default goalCollection;
