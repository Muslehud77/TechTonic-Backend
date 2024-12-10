import { JwtPayload } from 'jsonwebtoken';
import { User } from '../User/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { USER_STATUS } from '../User/user.constant';
import { TImageFile } from '../../interfaces/image.interface';
import { TUserProfileUpdate } from './profile.interface';
import { jwtPayloadMaker } from '../../utils/jwtPayloadMaker';
import { TUser } from '../User/user.interface';
import { createToken } from '../../utils/verifyJWT';
import config from '../../config';

const getMyProfile = async (user: JwtPayload) => {
  const profile = await User.findOne({
    email: user.email,
    status: USER_STATUS.ACTIVE,
  });

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exixts!');
  }

  return profile;
};

const updateMyProfile = async (
  user: JwtPayload,
  data: Partial<TUserProfileUpdate>,
  profilePhoto: TImageFile
) => {
  const filter = {
    email: user.email,
    status: USER_STATUS.ACTIVE,
  };

  const profile = await User.findOne(filter);

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, 'User profile does not exists!');
  }

  if (profilePhoto) {
    data.profilePhoto = profilePhoto.path;
  } else {
    delete data.profilePhoto;
  }

  const updatedUser = (await User.findOneAndUpdate(filter, data, {
    new: true,
  })) as TUser;

  const jwtPayload = jwtPayloadMaker(updatedUser);
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

export const ProfileServices = {
  getMyProfile,
  updateMyProfile,
};
