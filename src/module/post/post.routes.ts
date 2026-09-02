import { Router } from 'express';
import { upload } from '../../config/multer.config.js';
import { PostController } from './post.controller.js';

const router = Router();

router.post('/create', upload.single('thumbnail'), PostController.createPost);

router.get('/', PostController.getAllPosts);

router.get('/:id', PostController.getPostById);

router.patch(
  '/update/:id',
  upload.single('thumbnail'),
  PostController.updatePost
);

router.patch('/serial/:id', PostController.updatePostSerial);

router.delete('/delete/:id', PostController.deletePost);

export const PostRoutes: Router = router;
