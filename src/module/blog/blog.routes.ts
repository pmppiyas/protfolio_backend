import { Router } from 'express';
import { upload } from '../../config/multer.config.js';
import { BlogController } from './blog.controller.js';

const router = Router();

router.post('/create', upload.single('thumbnail'), BlogController.createPost);
router.get('/', BlogController.getAllBlogs);
router.get('/:id', BlogController.getByBlogId);
router.patch('/update/:id', upload.single('thumbnail'), BlogController.updateBlog);
router.delete('/delete/:id', BlogController.deleteBlog);

export const BlogRoutes: Router = router;
