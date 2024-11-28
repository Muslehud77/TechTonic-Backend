import { ObjectId } from "mongoose";

interface Image {
  url: string; // URL of the image
  caption: string; // Optional caption for the image
}

interface IPost {
  title: string; // Title of the post
  content: string; // The body/content of the post (HTML or Markdown)
  category:
    | 'Web'
    | 'Software Engineering'
    | 'AI'
    | 'Mobile'
    | 'Networking'
    | 'Other'; // Category of the post
  tags: string[]; // Tags associated with the post
  images: Image[]; // Array of images with optional captions
  isPremium: boolean; // Whether the post is premium or not
  author: ObjectId; // Author ID (user who created the post)
  upvotes: ObjectId[]; // List of user IDs who upvoted the post
  downvotes: ObjectId[]; // List of user IDs who downvoted the post
  createdAt: string; // Timestamp of post creation
  updatedAt: string; // Timestamp of last update
  // Optional additional fields
  visibility?: 'public' | 'private' | 'restricted'; // Privacy setting for the post
}

export default IPost;
