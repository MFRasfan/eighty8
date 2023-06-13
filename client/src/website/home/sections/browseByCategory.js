import React from 'react'
import Button from '../../../component/button'
import { categories } from '../../../data/category'
import {useNavigate} from 'react-router-dom'

const BrowseByCategory = () => {
 
  const navigate =useNavigate()
  const categoryContainer=(item,index)=>{
    return(
      <div className='px-20 text-center'>
       <p className={`text-3xl  font-bold text-gray-700 my-20`}> {item.title}</p>
      <div class="grid grid-cols-2 gap-4  md:grid-cols-4 md:gap-4">
      {item.subcategory.map((item,index)=>(
          <div onClick={()=>navigate(`/shop?${item.item}`)}>
            <p 
              className='text-gray-700 hover:text-primary hover:font-bold  duration-300 ease-in-out cursor-pointer'
            >{item.item}</p>
          </div>
       ))}
      </div>
      </div>
    )
  }
  return (
    <div className='mt-10'>
      {categories.map((item,index)=>categoryContainer(item,index) )}
      <p className='text-3xl text-gray-700 text-center pt-20 pb-10 font-bold'>Buy your next car online</p>
      <div className='flex items-center justify-center'>
      <Button title={"Shop cars"} onClick={()=>navigate("/shop")}/>
      </div>

     
    </div>
  )
}

export default BrowseByCategory