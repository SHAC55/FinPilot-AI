import React from 'react'
import ExpenseTable from './ExpenseTable'
import SummaryCard from '../components/SummaryCard'


const Expense = () => {
  return (
    <div>

      <div className='flex '>
      <SummaryCard/>
     
      </div>

      <ExpenseTable/>
    </div>
  )
}

export default Expense