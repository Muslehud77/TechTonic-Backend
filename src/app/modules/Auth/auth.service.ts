import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../../utils/verifyJWT';
import { USER_ROLE } from '../User/user.constant';
import { User } from '../User/user.model';
import { TLoginUser, TRegisterUser } from './auth.interface';
import { TUser } from '../User/user.interface';
import { EmailHelper } from '../../utils/emailSender';

const registerUser = async (payload: TRegisterUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is already exist!');
  }

  payload.role = USER_ROLE.USER;

  //create new user
  const newUser = await User.create(payload);

  //create token and sent to the  client

  const jwtPayload = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    mobileNumber: newUser.mobileNumber,
    role: newUser.role,
    status: newUser.status,
    profilePhoto: newUser?.profilePhoto,
    isPremium: newUser?.isPremium,
    expireAt: newUser?.expireAt,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: TLoginUser) => {
  const returnUserData = (user: TUser) => {
    const jwtPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      status: user.status,
      profilePhoto: user?.profilePhoto,
      isPremium: user?.isPremium,
      expireAt: user?.expireAt,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
    };
  };

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user && payload?.provider) {
    const newUser = await User.create({
      email: payload.email,
      role: USER_ROLE.USER,
      profilePhoto:
        payload.profilePhoto ||
        'https://media.istockphoto.com/id/610003972/zh/%E5%90%91%E9%87%8F/vector-businessman-black-silhouette-isolated.jpg?s=1024x1024&w=is&k=20&c=fHByVo4W93dYjuMnLjdkbQ8suH7V_Y3TKB45aU4FShw=',
      name: payload.name,
    });

    return returnUserData(newUser);
  }

  if (!user && payload?.password) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (user.status === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (user && payload?.provider) {
    return returnUserData(user);
  }

  if (user && payload?.password) {
    if (
      !(await User.isPasswordMatched(
        payload?.password,
        user?.password as string
      ))
    )
      throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

    return returnUserData(user);
  }
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //checking if the password is correct

  if (
    !(await User.isPasswordMatched(
      payload.oldPassword,
      user?.password as string
    ))
  )
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { email, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    profilePhoto: user.profilePhoto,
    role: user.role,
    status: user.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const forgotPassword = async (email: string) => {
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }
const userStatus = user?.status;

if (userStatus === 'BLOCKED') {
  throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
}
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    profilePhoto: user.profilePhoto,
    role: user.role,
    status: user.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m'
  );

  const resetLink = `${config.client_url}/reset-password?id=${user._id}&token=${accessToken}`;

  const emailResponse = await EmailHelper.sendEmail(
    user.email,
    EmailHelper.generatePasswordResetEmail(user.name, resetLink),
    'Reset Password (TechTonic)'
  );

  if (emailResponse.accepted.length > 0) {
    return 'Email sent successfully!';
  } else {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Email not sent!');
  }
};


const resetPassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //checking if the password is correct

  if (
    !(await User.isPasswordMatched(
      payload.oldPassword,
      user?.password as string
    ))
  )
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};



export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
};
