class serviceStorage {
  getStorage({ storage_name, storage_type = "string" }) {
    const stored_data = localStorage.getItem(storage_name) ?? null;
    return storage_type === "string" ? stored_data : JSON.parse(stored_data);
  }

  setStorage({ storage_name, storage_value, storage_type = "string" }) {
    storage_type === "string"
      ? localStorage.setItem(storage_name, storage_value)
      : localStorage.setItem(storage_name, JSON.stringify(storage_value));
  }

  removeStorage(storage_name) {
    localStorage.removeItem(storage_name);
  }
}

export default new serviceStorage();
