import express from  'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addSplit, deleteSplit, fetchAllSplits, getCompletedSplits, markSplitAsCompleted, sendReminder, updateAmountsAndNotify,  } from '../controller/splitController.js';


const splitRouter = express.Router()

splitRouter.post("/sendReminder/:id",authMiddleware,sendReminder)
splitRouter.post('/add-split',authMiddleware,addSplit)
splitRouter.get('/allsplits',authMiddleware,fetchAllSplits)
splitRouter.delete('/deletesplit/:id',authMiddleware,deleteSplit)
splitRouter.patch("/updateAmounts/:id", authMiddleware,updateAmountsAndNotify);
splitRouter.patch("/:id", authMiddleware,markSplitAsCompleted);
splitRouter.get('/completedsplits',authMiddleware,getCompletedSplits)



export default splitRouter  ;