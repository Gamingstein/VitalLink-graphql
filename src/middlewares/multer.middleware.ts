import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "$HOME/uploads");
    // cb(null, "./public/temp");
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
