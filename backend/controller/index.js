const queries = require("../database/queries");
const scripts = require("../public/scripts");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.getHomePage = (req, res) => {
  res.send("Welcome to the Home Page");
};

const validateRegisterInputs = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers")
    .custom(async (username) => {
      // Your existing duplicate check query
      const userExists = await queries.getUserByUsername(username);
      if (userExists) {
        throw new Error("Username already exists");
      }
      return true; // Validation passed
    }),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 6 characters"),
];

exports.createUser = [
  validateRegisterInputs,
  async (req, res) => {
    const { username, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const passwordHash = scripts.genPassword(password);

    try {
      const user = await queries.createUser(username, passwordHash);

      jwt.sign(
        { id: user.id, username: user.username, isAuthor: user.author },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
        (err, token) => {
          if (err) {
            console.error("Error signing JWT:", err);
            return res.status(500).json({ message: "Internal Server Error" });
          }
          res
            .status(201)
            .json({ message: "User created successfully", token: token });
        },
      );
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await queries.getUserByUsername(username);
    const validPword = scripts.validPassword(password, user.passwordHash);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!validPword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    jwt.sign(
      { id: user.id, username: user.username, isAuthor: user.author },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          console.error("Error signing JWT:", err);
          return res.status(500).json({ message: "Internal Server Error" });
        }
        res.status(201).json({ token: token });
      },
    );
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createPost = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const { title, introduction, content, published } = req.body;

      try {
        const post = await queries.createPost(
          authData.id,
          title,
          introduction,
          content,
          published,
        );
        res
          .status(201)
          .json({ message: "Post created successfully", post: post });
      } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
};

exports.updatePost = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const { title, introduction, content, published } = req.body;

      try {
        const post = await queries.updatePost(
          req.params.id,
          title,
          introduction,
          content,
          published,
        );
        res
          .status(201)
          .json({ message: "Post updated successfully", post: post });
      } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await queries.getAllPosts();
    res.status(200).json({ posts: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await queries.getPostById(req.params.id);
    res.status(200).json({ post: post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.publishPost = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const post = await queries.publishPost(req.params.id);
        res.status(200).json({ post: post });
      } catch (error) {
        console.error("Error publishing post:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
};

exports.unpublishPost = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const post = await queries.unpublishPost(req.params.id);
        res.status(200).json({ post: post });
      } catch (error) {
        console.error("Error unpublishing post:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
};

exports.deletePost = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const post = await queries.deletePost(req.params.id);
        res
          .status(200)
          .json({ message: "Post deleted successfully", post: post });
        await queries.deleteCommentByPostId(req.params.id).restatus(200).json({
          message: "Comments deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
};

exports.deleteComment = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const comment = await queries.deleteComment(req.params.id);
        res
          .status(200)
          .json({ message: "Comment deleted successfully", comment: comment });
      } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
};

exports.createComment = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const comment = await queries.createComment(
          req.body.postId,
          req.body.content,
          authData.id,
          authData.username,
        );
        res
          .status(201)
          .json({ message: "Comment created successfully", comment: comment });
      } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
};

exports.getCommentsByPostId = async (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const comments = await queries.getCommentsByPostId(req.params.id);
        res.status(200).json({ comments: comments });
      } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
};
