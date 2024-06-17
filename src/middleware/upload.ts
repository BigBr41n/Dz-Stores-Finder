import multer from "multer"; 
import { Request } from "express";
import * as path from "path";

interface MulterFile {
  fieldname: string;
  originalname: string;
}

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: MulterFile,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "uploads/logo");
  },
  filename: function (
    req: Request,
    file: MulterFile,
    cb: (error: Error | null, filename: string) => void
  ) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

export default multer({ storage: storage });