import { makeObservable, observable, action } from "mobx";
import BaseCustomStore from "./BaseCustomStore";

/**
 * A BaseCustomStore that also knows how to fetch a "count" of records
 * from the backend (e.g. GET /items/count) without disturbing the
 * items/loading/error contract the rest of the app relies on.
 *
 * The `service` passed in (e.g. itemService) must expose a
 * `getCount(params)` method that hits the count endpoint.
 */
export class CountCollection extends BaseCustomStore {
  count = 0;
  countLoading = false;
  countError = null;

  constructor(service, modelClass) {
    super(service, modelClass);
    makeObservable(this, {
      count: observable,
      countLoading: observable,
      countError: observable,
      setCount: action,
      setCountLoading: action,
      setCountError: action,
      fetchCount: action,
    });
  }

  setCount(value) {
    this.count = value;
  }

  setCountLoading(value) {
    this.countLoading = value;
  }

  setCountError(value) {
    this.countError = value;
  }

  async fetchCount(params = {}) {
    if (typeof this.service.getCount !== "function") {
      this.setCountError("Count endpoint is not configured for this service.");
      return null;
    }

    this.setCountLoading(true);
    this.setCountError(null);
    try {
      const response = await this.service.getCount(params);
      const value = response?.data ?? response;
      this.setCount(value);
      return value;
    } catch (err) {
      this.setCountError("Could not load count.");
      return null;
    } finally {
      this.setCountLoading(false);
    }
  }

  getValueByCriterias(criterias, fieldToGet) {
    return this.items.find((item) =>
      Object.entries(criterias).every(([key, val]) => item[key] === val),
    )?.[fieldToGet];
  }
}

export default CountCollection;
