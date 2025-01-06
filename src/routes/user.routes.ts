import { Router } from "express";
import { authMiddleware, upload } from "../middlewares";
import { services } from "../services";

import fileUpload from "express-fileupload";

const router = Router();

// router.post(
//   "/register",
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1,
//     },
//   ]),
//   services.user.registerUser,
// );
router.post(
  "/register",
  fileUpload({ useTempFiles: true }),
  services.user.registerUser,
);

router.all("/", (_, res) => res.send("User route"));
router.post("/login", services.user.loginUser);
router.get("/logout", authMiddleware, services.user.logoutUser);
router.get("/me", authMiddleware, services.user.currentUser);

export default router;
