import React, { useContext, useState } from 'react';
import ReactStars from 'react-stars';
import { reviewRef,db } from '../firebase/Firebase';
import { addDoc, doc, updateDoc, query, where, getDocs} from 'firebase/firestore';
import { TailSpin } from 'react-loader-spinner';
import swal from 'sweetalert';
import { useEffect } from 'react';
import { Appstate } from '../App';
import { useNavigate } from 'react-router-dom';

const Review = ({id,prevRating,userRated}) => {
    const useAppstate = useContext(Appstate);

    const navigate = useNavigate();

    const [rating, setRating] = useState(0);

    const [loading,setLoading] = useState(false);

    const[form,setForm] = useState("");

    const [data,setData] = useState([]);

    const [newAdded,setNewAdded] = useState(0);

    const [reviewLoading, setReviewLoading] = useState(false);

    const sendReview = async () =>{
        setLoading(true);
        if(useAppstate.login){
        await addDoc(reviewRef,{
            movieid:id,
            name: useAppstate.userName,
            rating:rating,
            thought:form

        });
        setLoading(false);

        const ref = doc(db, "movies",id);
        await updateDoc(ref,{
            rating : prevRating+rating,
            rated : userRated + 1
        })
        setRating(0);
        setForm("");
        setNewAdded(newAdded+1);

        swal({
            title:"Review added successfully",
            icon:"success",
            buttons:false,
            timer:3000
        });
      }else{
        navigate('/login');
      }
    }

    useEffect(()=>{
      async function getData(){
        setReviewLoading(true);
        let quer = query(reviewRef, where('movieid','==',id));
        const querySnapshot = await getDocs(quer);

        querySnapshot.forEach((doc)=>{
          setData((prev)=>[...prev,doc.data()])
        })

        setReviewLoading(false);
      }
      getData();
    },[newAdded])

  return (
    <div className='mt-4 w-full'>
      <ReactStars size={35} half={true} onChange={(rate)=>setRating(rate)}  value={rating}/>
      <input value={form} onChange={(e) => setForm(e.target.value)} type='text' className='text-black w-full p-2 outline-none' placeholder='Write review about movies'/>
      <button className='bg-red-600 w-full p-2 mt-2 flex justify-center' onClick={sendReview}>
        {loading ? <TailSpin height={25} color='white'/> :'Share'}
      </button>

      {reviewLoading ? 
      <div className='mt-3 flex justify-center'>
        <TailSpin height={40} color='white'/>
      </div>
      :
      <div className='mt-5'>
        <h3 className='text-white mb-3 w-full'>Comments :</h3>
        {
          data.map((e,i)=>{
            return(
              <div key={i} className='bg-gray-900 w-full p-3 mt-2'>
                <p>{e.name}</p>
                <p>{e.thought}</p>
                <ReactStars size={15} half={true} value={e.rating} edit={false}/>
              </div>
            )
          })
        }
      </div>

      }
    </div>
  )
}
 
export default Review;
