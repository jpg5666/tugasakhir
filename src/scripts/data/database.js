import { openDB } from "idb";

const dbPromise = openDB("story-db", 1, {
  upgrade(db) {
    db.createObjectStore("stories", { keyPath: "id" });
  },
});

export async function saveStoryList(stories) {
  const db = await dbPromise;
  const tx = db.transaction("stories", "readwrite");
  const store = tx.objectStore("stories");
  await store.clear();
  for (const story of stories) {
    await store.put(story);
  }
  await tx.done;
}

export async function getStoryList() {
  const db = await dbPromise;
  return await db.getAll("stories");
}
