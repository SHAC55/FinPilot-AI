import express from  'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { financeAnalysisAI } from '../controller/aiinsightController.js'

const  financeAnalysisRouter = express.Router()

financeAnalysisRouter.get('/finance-analysis',authMiddleware,financeAnalysisAI)

export default financeAnalysisRouter ;