import React from 'react'
import AddSplitButton from '../components/AddSplitButton'
import GetAllSplits from '../components/GetAllSplits'
import CompletedSplitButton from '../components/CompletedSplitButton'


const Split = () => {
  return (
    <div className='p-2'>

      <div className='flex md:flex-row flex-col gap-2'>
      <AddSplitButton/>
      <CompletedSplitButton/>
      </div>

      <GetAllSplits/>
    </div>
  )
}

export default Split