
import { z } from 'zod';


const createCommentValidationSchema = z.object({
  body: z.object({
    post: z.string().nonempty(),
    comment: z.string().nonempty(),
    replyTo: z.string().nullable().optional(),
  }),
});

const updateCommentValidationSchema = z.object({
  body: z.object({
    comment: z.string().nonempty(),
  }),
});



export const CommentValidation = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};
