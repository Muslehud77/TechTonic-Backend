import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { PostRoutes } from '../modules/post/post.route';
import { ItemCategoryRoutes } from '../modules/ItemCategory/itemCategory.route';
import { ProfileRoutes } from '../modules/Profile/profile.route';
import { ClaimRequestRoutes } from '../modules/ClaimRequest/claimRequest.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  // {
  //   path: '/item-categories',
  //   route: ItemCategoryRoutes,
  // },
  {
    path: '/post',
    route: PostRoutes,
  },
  // {
  //   path: '/claim-request',
  //   route: ClaimRequestRoutes,
  // },

  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
