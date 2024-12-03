import { ObjectId } from 'mongoose';


export type TComment = {
  _id: ObjectId;
  user: ObjectId;
  post: ObjectId;
  comment: string;
  replyTo : ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}