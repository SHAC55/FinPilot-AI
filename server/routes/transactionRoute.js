import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addCredit, addDebit, addExpense, archiveTransaction, deleteCredit, deleteDebit, deleteExpense, getArchivedCredit, getArchivedDebit,getUserCredit, getUserDebit, getUserExpenses, manualArchive, markCreditAsCompleted, markDebitAsCompleted } from '../controller/transactionController.js'


const transactionRouter = express.Router()

transactionRouter.post('/add-expense',authMiddleware,addExpense)
transactionRouter.get('/get-expenses',authMiddleware,getUserExpenses)
transactionRouter.delete('/delete-expense/:id',authMiddleware,deleteExpense)

// credit
transactionRouter.post('/add-credit',authMiddleware,addCredit)
transactionRouter.get('/getallcredit',authMiddleware,getUserCredit)
transactionRouter.patch('/credit/:id',authMiddleware,markCreditAsCompleted)
transactionRouter.delete('/delete-credit/:id', authMiddleware, deleteCredit)   
transactionRouter.get('/getcompletedcredit', authMiddleware, getArchivedCredit)

// debit
transactionRouter.post('/add-debit',authMiddleware,addDebit)
transactionRouter.get('/getalldebit',authMiddleware,getUserDebit)
transactionRouter.patch('/debit/:id',authMiddleware,markDebitAsCompleted)
transactionRouter.delete('/delete-debit/:id', authMiddleware, deleteDebit)   
transactionRouter.get('/getcompletedebit', authMiddleware, getArchivedDebit)

// archive
transactionRouter.get('/archivetransaction/:userId',authMiddleware,archiveTransaction)
transactionRouter.post('/manual-archive',authMiddleware,manualArchive)




export default transactionRouter