import mongoose from 'mongoose';
import { z } from 'zod';

const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    content: z.string({
      required_error: 'Content is required',
    }),
    captions: z.array(z.string()).optional(),
    category: z
      .string({
        required_error: 'Category is required',
      }),
    tags: z.array(z.string()).optional(), // Tags related to the post
    isPremium: z.boolean().optional(), // Whether the post is premium or not
    author: z
      .string({
        required_error: 'Author is required',
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val); // Ensure valid ObjectId for author
      }),
  
    dateCreated: z
      .string({
        required_error: 'Creation date is required',
      })
      .refine((val) => {
        return new Date(val).toString() !== 'Invalid Date';
      }),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    images: z.array(z.string()).optional(),
    category: z
      .string()
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      })
      .optional(),
    tags: z.array(z.string()).optional(),
    isPremium: z.boolean().optional(),
    author: z
      .string()
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      })
      .optional(),
    location: z.string().optional(),
    dateCreated: z
      .string()
      .refine((val) => {
        return new Date(val).toString() !== 'Invalid Date';
      })
      .optional(),
  }),
});

const upvoteAndDownvotePostValidationSchema = z.object({
  body: z.object({
    action: z.enum(['upvote', 'downvote', 'clear']),
    postId: z.string({
      required_error: 'Post ID is required',})
  }),
})

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
  upvoteAndDownvotePostValidationSchema,
};
