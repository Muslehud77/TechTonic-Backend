import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-user',
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.userRegister
);
router.get('/', auth(USER_ROLE.ADMIN), UserControllers.getAllUsers);
router.get('/:id', auth(USER_ROLE.ADMIN), UserControllers.getSingleUser);
router.put(
  '/follow-unfollow/:followId',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  UserControllers.followUnFollowUser
);

export const UserRoutes = router;
