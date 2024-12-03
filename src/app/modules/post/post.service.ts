import mongoose, { ObjectId } from 'mongoose';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TImageFiles } from '../../interfaces/image.interface';

import IPost from './post.interface';
import { Post } from './post.model';
import { Comment } from '../Comment/comment.model';
import httpStatus from 'http-status';

const createPostIntoDB = async (
  payload: IPost & { captions: string[] },
  images: TImageFiles
) => {
  const { postImages } = images;
  payload.images = postImages.map((image, i) => ({
    url: image.path,
    caption: payload?.captions[i],
  }));

  const result = await Post.create(payload);

  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    Post.find().populate('author'), // assuming the "author" is a reference to the User model
    query
  )
    .filter()
    .search(['title', 'tags', 'content']) // Search through relevant fields
    .sort()
    .fields();

  const result = await postQuery.modelQuery;

  return result;
};

const getPostFromDB = async (postId: string) => {
  const result = await Post.findById(postId).populate('author'); // Assuming you populate the author's information

  return result;
};

const updatePostInDB = async (postId: string, payload: Partial<IPost>) => {
  const result = await Post.findByIdAndUpdate(postId, payload, { new: true });

  return result;
};

const deletePostFromDB = async (postId: string) => {
  // Start a session
  const session = await mongoose.startSession();

  try {
    // Start a transaction
    session.startTransaction();

    // Delete all comments for the post within the same transaction
    await Comment.deleteMany({ post: postId }).session(session);

    // Delete the post
    const result = await Post.findByIdAndDelete(postId).session(session);

    // Commit the transaction
    await session.commitTransaction();

    // Return the result of the post deletion
    return result;
  } catch (error:any) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "something went wrong while deleting the post"); // Rethrow the error to be handled by the calling code
  } finally {
    // End the session
    session.endSession();
  }
};

const upvoteAndDownvotePostInDB = async (
  postId: ObjectId,
  userId: ObjectId,
  action: 'upvote' | 'downvote' | 'clear'
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(404, 'Post not found');
  }

  if (action === 'clear') {
    post.upvotes = post.upvotes.filter(
      (id) => id.toString() !== userId.toString()
    );
    post.downvotes = post.downvotes.filter(
      (id) => id.toString() !== userId.toString()
    );
  }

  if (action === 'upvote') {
    if (post.downvotes.includes(userId)) {
      post.downvotes = post.downvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }
    if (!post.upvotes.includes(userId)) {
      post.upvotes.push(userId);
    }
  } else if (action === 'downvote') {
    if (post.upvotes.includes(userId)) {
      post.upvotes = post.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }
    if (!post.downvotes.includes(userId)) {
      post.downvotes.push(userId);
    }
  }

  const result = await post.save();

  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  updatePostInDB,
  deletePostFromDB,
  upvoteAndDownvotePostInDB,
};
