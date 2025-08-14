import React from 'react'
import AddBill from '../components/AddBill'
import CompletedBill from '../components/CompletedBill'

const BillRemiander = () => {
  return (
    <div>

        <div className='flex gap-2 p-3 md:flex-row flex-col w-full'>
            <AddBill/>
            <CompletedBill/>
        </div>
    </div>
  )
}

export default BillRemiander