const express = require("express");
const router = express.Router();
const controller = require("../controller/index");
const scripts = require("../public/scripts");

router.post("/api/register", controller.createUser);
router.post("/api/login", controller.login); // Add handler when ready

router.post("/api/posts/create", scripts.verifyToken, controller.createPost);
router.put("/api/posts/update/:id", scripts.verifyToken, controller.updatePost);
router.get("/api/posts/get", controller.getAllPosts);
router.get("/api/posts/get/:id", controller.getPostById);
router.post(
  "/api/posts/publish/:id",
  scripts.verifyToken,
  controller.publishPost,
);
router.post(
  "/api/posts/unpublish/:id",
  scripts.verifyToken,
  controller.unpublishPost,
);
router.delete(
  "/api/posts/delete/:id",
  scripts.verifyToken,
  controller.deletePost,
);
router.post(
  "/api/comments/create",
  scripts.verifyToken,
  controller.createComment,
);
router.delete(
  "/api/comments/delete/:id",
  scripts.verifyToken,
  controller.deleteComment,
);

router.get(
  "/api/comments/get/:id",
  scripts.verifyToken,
  controller.getCommentsByPostId,
);

module.exports = router;
