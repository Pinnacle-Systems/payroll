import { Router } from 'express';
const router = Router();
import { get, getOne, getSearch,  create, update, remove,getleavecount} from '../controllers/leaveRequest.controller.js';


router.post('/', create);

router.get('/', get);

router.get('/:id', getOne);

router.get('/search/:searchKey', getSearch);

router.put('/:id', update);

router.delete('/:id', remove);

router.get('/:employeeId/leavecount', getleavecount);

export default router;