import { createCollections } from "@src/fire/createCollections";
import { CommentDoc, UserDoc } from "@src/fire/doc";
import { addDays } from "date-fns";

import { TopicDoc } from "./../src/fire/doc/topic";
import { clearFirestore } from "./test-util/clear";
import { clearAuth } from "./test-util/clear";
import { getAuth, getDb } from "./test-util/setup";

const shuffle = <T>(_arr: T[]) => {
  const arr = [..._arr];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const auth = getAuth();
const db = getDb();

const { usersCollection, topicsCollection } = createCollections(db);

const main = async () => {
  await Promise.all([clearAuth(), clearFirestore()]);

  const usersCount = 2;
  const authUsers = await Promise.all(
    Array.from({ length: usersCount }).map((_, idx) => {
      return auth.createUser({ email: `user-${idx}@example.com`, password: "password" });
    })
  );
  const users = await Promise.all(
    authUsers.map((authUser) => {
      return usersCollection.insert({
        id: authUser.uid,
        ...UserDoc.new({ displayName: authUser.email?.split("@").at(0) ?? "MyString" }),
      });
    })
  );

  const topicsCount = 13;
  const topics = await Promise.all(
    Array.from({ length: topicsCount }).map(async (_, idx) => {
      const user = shuffle(users)[0];
      const title = `topic-${idx}`;
      const content = `topic-${idx}-content`;
      const createdAt = addDays(new Date("1999-01-01"), idx);
      return topicsCollection.insert({
        ...TopicDoc.new({ title, content, userId: user.id }),
        createdAt,
        updatedAt: createdAt,
      });
    })
  );

  const commentsCount = 1087;
  const comments = await Promise.all(
    Array.from({ length: commentsCount }).map(async (_, idx) => {
      const topic = shuffle(topics)[0];
      const user = shuffle(users)[0];
      const content = `comment-${idx}`;
      const createdAt = addDays(topic.createdAt, idx);
      const commentData = CommentDoc.new({
        content,
        userId: user.id,
        parentName: "topic",
        parentId: topic.id,
      });
      return topic.commentsCollection.insert({
        id: commentData.__id,
        ...commentData,
        createdAt,
        updatedAt: createdAt,
      });
    })
  );

  const nestCommentsCount = 1087;
  const nestComments = await Promise.all(
    Array.from({ length: nestCommentsCount }).map(async (_, idx) => {
      const comment = shuffle(comments)[0];
      const user = shuffle(users)[0];
      const content = `nest-comment-${idx}`;
      const createdAt = addDays(comment.createdAt, idx);
      const commentData = CommentDoc.new({
        content,
        userId: user.id,
        parentName: "comment",
        parentId: comment.id,
      });
      return comment.commentsCollection.insert({
        id: commentData.__id,
        ...commentData,
        createdAt,
        updatedAt: createdAt,
      });
    })
  );

  console.log(nestComments.length);
};

main();
