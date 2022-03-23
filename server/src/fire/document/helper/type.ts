import * as admin from "firebase-admin";

type DocumentData = admin.firestore.DocumentData;
export type DocSnap<T = DocumentData> = admin.firestore.DocumentSnapshot<T>;
export type WithId<T> = T & { id: string };