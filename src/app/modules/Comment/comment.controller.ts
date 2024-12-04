import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const result = await CommentServices.createComment(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Commented Successfully!',
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const result = await CommentServices.deleteComment(
    req.params.commentId,
    userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment deleted Successfully!',
    data: result,
  });
});

const getCommentsByPost = catchAsync(async (req, res) => {
  const postId = req.params.postId;

  const result = await CommentServices.getCommentsByPostId(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comments Retrieved Successfully!',
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const commentId = req.params.commentId;
  const comment = req.body;
  const result = await CommentServices.updateComment(
    commentId,
    comment,
    userId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comment updated Successfully!',
    data: result,
  });
});


export const CommentControllers = {
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
 
};
