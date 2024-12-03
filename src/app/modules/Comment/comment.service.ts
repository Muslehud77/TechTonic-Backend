import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TComment } from './comment.interface';
import { Comment } from './comment.model';

// Get all comments by post ID, including populated user and replyTo fields
const getCommentsByPostId = async (postId: string) => {
  const result = await Comment.find({ post: postId })
    .populate('user')
    .populate('replyTo');
  return result;
};

// Get a single comment by its ID
const getCommentById = async (commentId: string) => {
  const result = await Comment.findById(commentId)
    .populate('user')
    .populate('replyTo');
  return result;
};

// Create a new comment
const createComment = async (comment: TComment,userId: string) => {
  const result = await Comment.create({...comment,user:userId});
  return result;
};

// Update an existing comment
const updateComment = async (commentId: string, comment: Partial<TComment>, userId:string) => {
  const result = await Comment.findByIdAndUpdate(
    {_id:commentId,user:userId},
    { $set: comment },
    { new: true } // Return the updated document
  );
  return result;
};

// Delete a comment by its ID
const deleteComment = async (commentId: string, userId: string) => {
  const result = await Comment.findByIdAndDelete({
    _id: commentId,
    user: userId,
  });

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'could not delete comment'
    );
  }

  return result;
};

// Add a reply to a comment
const addReplyToComment = async (
  parentCommentId: string,
  replyComment: TComment,
  userId :string
) => {
  // Set the `replyTo` field to the parent comment's ID
  const result = await Comment.create({
    ...replyComment,
    user  : userId,
    replyTo: parentCommentId,
  });
  return result;
};

export const CommentServices = {
  getCommentsByPostId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  addReplyToComment,
};
