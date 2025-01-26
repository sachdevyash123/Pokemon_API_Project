import React, { useState } from 'react'
import { GrPrevious,GrNext } from 'react-icons/gr';
import "../components/Pagination.css"
import { MdOutlineKeyboardDoubleArrowLeft,MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
interface PaginationProps {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    totalItems:number;
    itemsPerPage:number;
  }
const Pagination:React.FC<PaginationProps>= ({page,setPage,totalItems,itemsPerPage}) => {
  const[inputPage,setInputPage]=useState<number>(page);
  const totalPage:number=Math.ceil(totalItems/itemsPerPage)
  const handleNext=()=>{
        setPage(page+1)
    }
    const handlePrev=()=>{
        if(page<1){
            setPage(1);
        }
        setPage(page-1);
    }
    const handleGo=()=>{
      if(inputPage>=1 &&inputPage<=totalPage){
        setPage(inputPage)
      }
      else{
        alert(`Please enter page number between 1 to ${totalPage}`)
      }
    }
    const handlePageChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setInputPage(Number(e.target.value))
    }
  return (
    <div className='pagination-container d-flex justify-content-center align-items-center my-4'>
        <button className='pagination-btn mx-2' onClick={()=>setPage(1)} disabled={page === 1}><MdOutlineKeyboardDoubleArrowLeft/></button>
        <button className='pagination-btn mx-2' onClick={handlePrev} disabled={page===1} ><GrPrevious/></button>
        {/* <button className='pagination-btn btn btn-outline-primary mx-2' onClick={()=>setPage(2)}>2</button> */}
        <div className="page-number mx-3">
        <span>{`Page ${page} of ${totalPage} `}</span>
      </div>
        <button className='pagination-btn mx-2' onClick={handleNext} disabled={page>=totalPage}><GrNext/></button>
      
        <button className='pagination-btn mx-2' onClick={()=>setPage(totalPage)} disabled={page===totalPage}><MdOutlineKeyboardDoubleArrowRight/></button>
        <div className="input-container d-flex align-items-center mx-3">
        <input
          type="number"
          value={inputPage}
          onChange={handlePageChange}
          min="1"
          max={totalPage}
          className="form-control mx-2"
          style={{ width: '60px' }}
        />
        <button className="pagination-btn btn btn-outline-primary" onClick={handleGo}>
          Go
        </button>
      </div>
    </div>
  )
}

export default Pagination