import { CommentValidation } from './comment.validation';
import express from 'express';
import {
  ClaimRequestControllers,
  CommentControllers,
} from './comment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.USER),
  validateRequest(CommentValidation.createCommentValidationSchema),
  CommentControllers.createComment
);

router.delete(
  '/:commentId',
  auth(USER_ROLE.USER),
  CommentControllers.deleteComment
);

router.patch(
  '/:commentId',
  auth(USER_ROLE.USER),
  validateRequest(CommentValidation.updateCommentValidationSchema),
  CommentControllers.updateComment
);




router.get('/:postId', CommentControllers.getCommentsByPost);

export const CommentRouters = router;
