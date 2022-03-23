import { createConverter } from "./createConverter";
import { CollectionRef, Converter, DocSnap, Query } from "./type";

type WithId<T> = T & { id: string };

const mapper = <T>(snap: DocSnap<T>) => {
  const data = snap.data();
  if (!data) throw new Error("Data not found");
  return { id: snap.id, ...data };
};

export class Collection<TData> {
  private _ref: CollectionRef<TData>;
  constructor(_ref: CollectionRef, converter: Converter<TData> = createConverter<TData>()) {
    this._ref = _ref.withConverter(converter);
  }

  findOneById(id: string): Promise<WithId<TData>>;
  findOneById<T>(id: string, decode: (snap: DocSnap<TData>) => T): Promise<T>;
  findOneById<T>(id: string, decode?: (snap: DocSnap<TData>) => T) {
    if (!decode) return this._ref.doc(id).get().then(mapper);
    return this._ref.doc(id).get().then(decode);
  }

  findManyByQuery(queryFn: (ref: CollectionRef<TData>) => Query<TData>): Promise<WithId<TData>[]>;
  findManyByQuery<T>(
    queryFn: (ref: CollectionRef<TData>) => Query<TData>,
    decode: (snap: DocSnap<TData>) => T
  ): Promise<T[]>;
  findManyByQuery<T>(queryFn: (ref: CollectionRef<TData>) => Query<TData>, decode?: (snap: DocSnap<TData>) => T) {
    if (!decode)
      return queryFn(this._ref)
        .get()
        .then((q) => q.docs.map(mapper));
    return queryFn(this._ref)
      .get()
      .then((q) => q.docs.map(decode));
  }

  insert(data: (TData & { id?: undefined }) | (TData & { id: string })) {
    const { id, ..._data } = data;
    return id ? this._ref.doc(id).set(_data as unknown as TData) : this._ref.add(_data as unknown as TData);
  }
}