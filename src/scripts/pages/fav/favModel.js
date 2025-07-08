import { openDB } from "idb";

const dbPromise = openDB("fav-db", 1, {
  upgrade(db) {
    db.createObjectStore("favorites", { keyPath: "id" });
  },
});

export const favModel = {
  async getAll() {
    return (await dbPromise).getAll("favorites");
  },
  async getById(id) {
    return (await dbPromise).get("favorites", id);
  },
  async add(story) {
    return (await dbPromise).put("favorites", story);
  },
  async update(story) {
    return (await dbPromise).put("favorites", story);
  },
  async remove(id) {
    return (await dbPromise).delete("favorites", id);
  },
};
