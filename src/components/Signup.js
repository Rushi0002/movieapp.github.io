import React, { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber, getAuth } from "firebase/auth";
import app from '../firebase/Firebase';
import swal from 'sweetalert';
import { usersRef } from '../firebase/Firebase';
import { addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const auth = getAuth(app);

const Signup = () => {
  const navigate = useNavigate();
  const [form,setForm] = useState({
    name:"",
    mobile:"",
    password:""
  });

  const [loading,setLoading] = useState(false);
  const[otpSent,setOtpSent] = useState(false);
  const[OTP,setOTP] = useState(""); 

  const generateRecapcha = () => {
  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': (response) => {
      
    }
  }, auth);
  }

  const requestOtp = () => {
    setLoading(true);
    generateRecapcha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
    .then(confirmationResult =>{
      window.confirmationResult = confirmationResult;
      swal({
        title:"OTP SENT",
        icon:"success",
        buttons:false,
        timer:3000
      });
      setOtpSent(true);
      setLoading(false);
    }).catch(error => console.log(error))
  }

  const verifyOTP = () => {
    try {
      setLoading(true);
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadData();
        swal({
          title:"Registered Sucessfully",
          icon:"success",
          buttons:false,
          timer:3000
        });
        navigate('/login')
      setLoading(false);
      })
    } catch (error) {
      console.log(error);
    }
  }

  const uploadData = async () => {
    const salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(form.password, salt);
    await addDoc(usersRef,{
      name:form.name,
      password:hash,
      mobile:form.mobile
    })
  }

  return (
    <div className='w-full flex mt-6 flex-col items-center'>
      <h1 className='text-2xl font-bold'>Signup</h1>
      {otpSent ?
      <>
      <div class="p-2 w-full md:w-1/3">
        <div class="relative">
          <label for="message" class="leading-7 text-sm text-gray-300">OTP</label>
          <input id="message" name="message" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" value={OTP} onChange={(e)=>setOTP(e.target.value)}></input>
        </div>
      </div>

      <div class="p-2 w-full">
          <button onClick={verifyOTP} class="flex mx-auto text-white bg-red-600 border-0 py-2 px-8 focus:outline-none hover:bg-red-800 rounded text-lg transition-all hover:-translate-y-1">
            {loading ? <TailSpin height={25} color='white'/>:'Confirm OTP'}
          </button>
      </div>
      </>
      :
      <>

      <div class="p-2 w-full md:w-1/3">
          <div class="relative">
            <label for="message" class="leading-7 text-sm text-gray-300">Name</label>
            <input id="message" name="message" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}></input>
          </div>
      </div>

      <div class="p-2 w-full md:w-1/3">
          <div class="relative">
            <label for="message" class="leading-7 text-sm text-gray-300">Mobile Number</label>
            <input type={'number'} id="message" name="message" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" value={form.mobile} onChange={(e)=>setForm({...form, mobile:e.target.value})}></input>
          </div>
      </div>

      <div class="p-2 w-full md:w-1/3">
          <div class="relative">
            <label for="message" class="leading-7 text-sm text-gray-300">Password</label>
            <input id="message" name="message" class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})}></input>
          </div>
      </div>

      <div class="p-2 w-full">
          <button class="flex mx-auto text-white bg-red-600 border-0 py-2 px-8 focus:outline-none hover:bg-red-800 rounded text-lg transition-all hover:-translate-y-1" onClick={requestOtp}>
            {loading ? <TailSpin height={25} color='white'/>:'Request OTP'}
          </button>
      </div>

      </>
      }

      <div>
        <p>
          Already have an account? <Link to={'/login'}><span className='text-blue-500'>Login</span></Link>
        </p>
      </div>

      <div id='recaptcha-container'></div>
      
    </div>
  )
}

export default Signup
