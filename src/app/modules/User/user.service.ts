import mongoose from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UserSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(User.find(), query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.modelQuery;

  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);

  return user;
};

const followUnFollowUserInDB = async (userId: string, followId: string) => {
  // Start a session

  if (userId === followId) {
    throw new AppError(400, 'You cannot follow yourself');
  }

  const session = await mongoose.startSession();

  try {
    // Start a transaction
    session.startTransaction();

    const user = await User.findById(userId).session(session);
    const targetUser = await User.findById(followId).session(session);

    if (!user || !targetUser) {
      throw new AppError(404, 'User not found');
    }

    const isAlreadyFollowing = user.following!.includes(followId);

    if (isAlreadyFollowing) {
      // Unfollow the user
      user.following = user.following!.filter(
        (id) => id.toString() !== followId
      );
      targetUser.followers = targetUser.followers!.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Follow the user
      user.following!.push(followId);
      targetUser.followers!.push(userId);
    }

    // Save changes within the session
    await user.save({ session });
    await targetUser.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    return user;
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};

export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  followUnFollowUserInDB,
};
