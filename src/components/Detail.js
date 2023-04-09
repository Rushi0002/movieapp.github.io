import React, { useEffect, useState } from 'react';
import ReactStars from 'react-stars';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { TailSpin } from 'react-loader-spinner';
import Review from './Review';


const Detail = () => {
    const {id} = useParams();
    const [data,setData] = useState({
        title:"",
        image:"",
        year:"",
        description:"",
        rating: 0,
        rated: 0
    });

    const[loading,setLoading] = useState(false);

    useEffect(()=>{
        async function getData() {
            setLoading(true);
            const _doc = doc(db,"movies",id);
            const _data = await getDoc(_doc);
            setData(_data.data());
            setLoading(false);
        }   
        getData();
    },[])
  return (
    <div className='p-4 mt-4 flex flex-col md:flex-row items-center md:items-start w-full justify-center'>
    {loading ? <div className='w-full flex justify-center items-center min-h-screen'><TailSpin height={80} color='white'/></div> :
        <>
      <img className='h-100' src={data.image} alt='img'/>
      <div className='md:ml-4 ml-0 w-full md:w-1/2'>
        <h1 className='text-2xl font-bold mt-2'>{data.title} <span>({data.year})</span></h1>
        <ReactStars size={20} half={true} value={data.rating/data.rated} edit={false}/>
        <p className='mt-3'>
        {data.description}
        </p>

        <Review id={id} prevRating={data.rating} userRated={data.rated}/>
      </div>
      </>
    }
    </div>
  )
}

export default Detail
