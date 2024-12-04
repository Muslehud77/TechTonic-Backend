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

export const CommentServices = {
  getCommentsByPostId,
 
  createComment,
  updateComment,
  deleteComment,
  
};
