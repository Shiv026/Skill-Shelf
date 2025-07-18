import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    try{
      const fileName = `${Date.now()}-${req.user.user_id}${path.extname(file.originalname)}`;
      cb(null, fileName);
    }catch(error){
      cb(error, null);
    }

  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);

  if(isValidExt && isValidMime)
    cb(null, true);
  else
  cb(new Error('Only .jpeg or .jpg files are allowed'));
};
const upload = multer({storage, fileFilter});
export default upload;