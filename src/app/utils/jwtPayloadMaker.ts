import { TUser } from "../modules/User/user.interface";

export const jwtPayloadMaker = (user: TUser) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    status: user.status,
    profilePhoto: user?.profilePhoto,
    isPremium: user?.isPremium,
    expireAt: user?.expireAt,
    followers: user?.followers,
    following: user?.following,
  };
};
