import { Schema, model } from 'mongoose';
import { TComment } from './comment.interface';

const commentSchema = new Schema<TComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },

    comment: {
      type: String,
      required: true,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  {
    timestamps: true,
    virtuals: true,
  }
);

export const Comment = model<TComment>('Comment', commentSchema);
