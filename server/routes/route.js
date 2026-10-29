import express from 'express';

import { createPost, updatePost, deletePost, getPost, getAllPosts } from '../controller/post-controller.js';
import { uploadImage, getImage } from '../controller/image-controller.js';
import { newComment, getComments, deleteComment } from '../controller/comment-controller.js';
import { loginUser, singupUser, logoutUser } from '../controller/user-controller.js';
import { authenticateToken, createNewToken } from '../controller/jwt-controller.js';

import upload from '../utils/upload.js';

const router = express.Router();

const handleUpload = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ msg: 'File too large. Max size is 5MB' });
            }
            return res.status(400).json({ msg: err.message || 'File upload error' });
        }
        next();
    });
};

router.post('/login', loginUser);
router.post('/signup', singupUser);
router.post('/logout', authenticateToken, logoutUser);

router.post('/token', createNewToken);

router.post('/create', authenticateToken, createPost);
router.put('/update/:id', authenticateToken, updatePost);
router.delete('/delete/:id', authenticateToken, deletePost);

router.get('/post/:id', getPost);
router.get('/posts', getAllPosts);

router.post('/file/upload', authenticateToken, handleUpload, uploadImage);
router.get('/file/:filename', getImage);

router.post('/comment/new', authenticateToken, newComment);
router.get('/comments/:id', getComments);
router.delete('/comment/delete/:id', authenticateToken, deleteComment);

export default router;