import  express from  'express'
import authMiddleware from '../middleware/authMiddleware.js';
import { addBill, deleteBill, getCompletedBills, getUserBills, markBillAsCompleted } from '../controller/billsController.js';

const billsRouter = express.Router() ;

billsRouter.post('/add-bill',authMiddleware,addBill)
billsRouter.get('/get-bills',authMiddleware,getUserBills)
billsRouter.patch('/:id',authMiddleware,markBillAsCompleted)
billsRouter.get('/completedbills',authMiddleware,getCompletedBills)
billsRouter.delete('/delete-bill/:id',authMiddleware,deleteBill)

export default billsRouter ;
