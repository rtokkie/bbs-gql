import DataLoader from "dataloader";
import * as admin from "firebase-admin";
import { head } from "ramda";

export const createRootCollectionLoader = <TEntity extends { id: string }>(
  ref: admin.firestore.CollectionReference<TEntity>
) => {
  return new DataLoader<string, TEntity>((keys) =>
    Promise.all(
      keys.map(async (id) => {
        const dSnap = await ref.doc(id).get();
        const entity = dSnap.data();
        if (!entity) throw new Error(`data not found at ${dSnap.ref.path}`);
        return entity;
      })
    )
  );
};

export const createSubCollectionLoader = <TEntity extends { id: string; _id: string }, Key extends { id: string }>(
  ref: (params: Omit<Key, "id">) => admin.firestore.CollectionReference<TEntity>
) => {
  return new DataLoader<Key, TEntity>((keys) =>
    Promise.all(
      keys.map(async (key) => {
        const { id, ...params } = key;
        const dSnap = await ref(params).doc(id).get();
        const entity = dSnap.data();
        if (!entity) throw new Error(`data not found at ${dSnap.ref.path}`);
        return entity;
      })
    )
  );
};

export const createCollectionGroupLoader = <TEntity extends { id: string; _id: string }>(
  ref: admin.firestore.CollectionGroup<TEntity>
) => {
  return new DataLoader<string, TEntity>((keys) =>
    Promise.all(
      keys.map(async (id) => {
        const dSnap = await ref.where("_id", "==", id).get();
        const entity = head(dSnap.docs)?.data();
        if (!entity) throw new Error(`data not found at ${dSnap.query}`);
        return entity;
      })
    )
  );
};
