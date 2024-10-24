import {
  authMiddleware,
  doctorAuthMiddleware,
  hospitalAuthMiddleware,
} from "./auth.middleware";
import { upload } from "./multer.middleware";

export { authMiddleware, hospitalAuthMiddleware, doctorAuthMiddleware, upload };
