import express from 'express';
import { deleteUser, test, updateUser , signout } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { getUsers } from '../controllers/user.controller.js';
import { getUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test' , test);
router.put('/update/:userId' , verifyToken , updateUser);
router.delete('/delete/:userId' , verifyToken , deleteUser);
router.post('/signout' , signout);
router.get('/getusers' , verifyToken , getUsers);

router.get('/:userId' , getUser);
// Fetching the user data for the comment section

export default router;