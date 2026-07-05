import { makeObservable, observable, action } from "mobx";

export class BaseCustomStore {
  items = [];
  loading = false;
  error = null;

  constructor(service, modelClass) {
    this.service = service;
    this.modelClass = modelClass;
    makeObservable(this, {
      items: observable,
      loading: observable,
      error: observable,
      setItems: action,
      setLoading: action,
      setError: action,
      loadAll: action,
      create: action,
      update: action,
      delete: action,
    });
  }

  setItems(items) {
    this.items = items;
  }

  setLoading(value) {
    this.loading = value;
  }

  setError(value) {
    this.error = value;
  }

  async loadAll() {
    this.setLoading(true);
    this.setError(null);
    try {
      const response = await this.service.getAll();
      const nextItems = (response.data || []).map(
        (item) => new this.modelClass(item),
      );
      this.setItems(nextItems);
    } catch (err) {
      this.setError("Could not load data.");
    } finally {
      this.setLoading(false);
    }
  }

  async create(payload) {
    try {
      await this.service.create(payload);
      await this.loadAll();
    } catch (err) {
      this.setError("Could not create item.");
    }
  }

  async update(id, payload) {
    try {
      await this.service.update(id, payload);
      await this.loadAll();
    } catch (err) {
      this.setError("Could not update item.");
    }
  }

  async delete(id) {
    try {
      await this.service.delete(id);
      await this.loadAll();
    } catch (err) {
      this.setError("Could not delete item.");
    }
  }
}

export default BaseCustomStore;
