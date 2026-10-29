import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.MONGO_URL;

const storage = new GridFsStorage({
    url: URL,
    options: { useNewUrlParser: true },
    file: (request, file) => {
        const match = ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/gif"];

        if (match.indexOf(file.mimetype) === -1) {
            return null;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname.replace(/[^a-zA-Z0-0.-]/g, '_')}`
        };
    }
});

const fileFilter = (request, file, cb) => {
    const match = ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/gif"];
    if (match.indexOf(file.mimetype) === -1) {
        return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
};

export default multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); 