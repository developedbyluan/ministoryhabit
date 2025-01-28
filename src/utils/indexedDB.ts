export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // const request = indexedDB.open("VideoDB", 6);
    const request = indexedDB.open("DontTryHabitDB", 1)

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (db.objectStoreNames.contains("videos")) {
        db.deleteObjectStore("videos");
      }
      const videoStore = db.createObjectStore("videos", { keyPath: "name" });
      videoStore.createIndex("name", "name", { unique: true });

      if (db.objectStoreNames.contains("texts")) {
        db.deleteObjectStore("texts");
      }
      const textStore = db.createObjectStore("texts", { keyPath: "name" });
      textStore.createIndex("name", "name", { unique: true });
    };
  });
}

export async function saveVideo(videoBlob: Blob, name: string): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["videos"], "readwrite");
      const store = transaction.objectStore("videos");
      const request = store.put({ blob: videoBlob, name });
  
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch(error) {
    alert(`Failed to save video: ${error}`)
    // throw error
  }
  
}

export async function getVideo(
  name: string
): Promise<{ blob: Blob; name: string } | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["videos"], "readonly");
    const store = transaction.objectStore("videos");
    const request = store.get(name);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllVideos(): Promise<{ name: string }[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["videos"], "readonly");
    const store = transaction.objectStore("videos");
    const request = store.getAll();

    request.onsuccess = () => {
      const videos = request.result.map(({ name }) => ({ name }));
      resolve(videos);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteVideo(name: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["videos"], "readwrite");
    const store = transaction.objectStore("videos");
    const request = store.delete(name);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveText(name: string, content: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["texts"], "readwrite");
    const store = transaction.objectStore("texts");
    const request = store.put({ name, content });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getText(
  name: string
): Promise<{ name: string; content: string } | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["texts"], "readonly");
    const store = transaction.objectStore("texts");
    const request = store.get(name);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllTexts(): Promise<
  { name: string; content: string }[]
> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["texts"], "readonly");
    const store = transaction.objectStore("texts");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteText(name: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["texts"], "readwrite");
    const store = transaction.objectStore("texts");
    const request = store.delete(name);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
