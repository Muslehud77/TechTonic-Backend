import { Schema, model } from 'mongoose';

import IPost from './post.interface';

const postSchema = new Schema<IPost>(
  {
    // Basic information about the post
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Web',
        'Software Engineering',
        'AI',
        'Mobile',
        'Networking',
        'Other',
      ], // Can be expanded
      required: true,
    },
    tags: {
      type: [String], // Array of tags for filtering/searching
      default: [],
    },
    // Store images or files for the post
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' }, // Optional caption for the image
      },
    ],
    isPremium: {
      type: Boolean,
      default: false, // Whether this post is premium (accessible to verified users)
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User who created the post
      required: true,
    },
    // Interaction with the post
    upvotes: {
      type: [Schema.Types.ObjectId], // Array of user IDs who upvoted
      ref: 'User',
      default: [],
    },
    downvotes: {
      type: [Schema.Types.ObjectId], // Array of user IDs who downvoted
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true, // This will automatically create 'createdAt' and 'updatedAt' fields
  }
);

export const Post = model<IPost>('Post', postSchema);
