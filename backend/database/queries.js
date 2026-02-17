const { prisma } = require("./pg");

exports.getUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username: username },
  });
};

exports.createUser = async (username, passwordHash) => {
  return await prisma.user.create({
    data: {
      username: username,
      passwordHash: passwordHash,
    },
  });
};

exports.createPost = async (
  authorId,
  title,
  introduction,
  content,
  published,
) => {
  return await prisma.post.create({
    data: {
      title: title,
      introduction: introduction,
      content: content,
      published: published,
      author: {
        connect: {
          id: authorId,
        },
      },
    },
  });
};

exports.updatePost = async (id, title, introduction, content, published) => {
  return await prisma.post.update({
    where: { id: id },
    data: {
      title: title,
      introduction: introduction,
      content: content,
      published: published,
    },
  });
};

exports.getAllPosts = async () => {
  return await prisma.post.findMany({
    include: {
      comments: true,
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

exports.getPostById = async (id) => {
  return await prisma.post.findUnique({
    where: { id: id },
    include: {
      comments: true,
      author: true,
    },
  });
};

exports.publishPost = async (id) => {
  return await prisma.post.update({
    where: { id: id },
    data: { published: true },
  });
};

exports.unpublishPost = async (id) => {
  return await prisma.post.update({
    where: { id: id },
    data: { published: false },
  });
};

exports.deletePost = async (id) => {
  return await prisma.post.delete({
    where: { id: id },
  });
};

exports.createComment = async (postId, content, userId, username) => {
  return await prisma.comment.create({
    data: {
      content: content,
      post: {
        connect: {
          id: postId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      username: username,
    },
  });
};
exports.deleteComment = async (id) => {
  return await prisma.comment.delete({
    where: { id: id },
  });
};
exports.deleteCommentByPostId = async (postId) => {
  return await prisma.comment.deleteMany({
    where: { postId: postId },
  });
};

exports.getCommentsByPostId = async (id) => {
  return await prisma.comment.findMany({
    where: { postId: id },
    include: {
      userId: true,
    },
  });
};
