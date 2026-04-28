import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCEjYyMwJ_jvl-bODjkxzB6zLf4IdBD0Q0",
  authDomain: "camping-cc5b3.firebaseapp.com",
  projectId: "camping-cc5b3",
  storageBucket: "camping-cc5b3.firebasestorage.app",
  messagingSenderId: "464910585690",
  appId: "1:464910585690:web:10185a6585c584956a2d63"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const saveRecordToFirebase = async (recordData: any) => {
  try {
    await addDoc(collection(db, "logs"), {
      ...recordData,
      createdAt: serverTimestamp()
    });
    console.log("資料已成功上傳雲端！");
  } catch (e) {
    console.error("上傳失敗: ", e);
    throw e;
  }
};

export const subscribeToLogs = (callback: (records: any[]) => void) => {
  const q = query(collection(db, "logs"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const records: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt && data.createdAt.toDate) {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      records.push(data);
    });
    callback(records);
  }, (error) => {
    console.error("Firebase onSnapshot error:", error);
  });
};
