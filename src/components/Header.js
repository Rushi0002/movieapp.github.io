import React, { useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Appstate } from '../App';

const Header = () => {
  const useAppState = useContext(Appstate);

  return (
    <div className='sticky top-0 z-10 header text-2xl text-red-700 font-bold p-3 border-b-2 border-grey-400 flex justify-between items-center'>
      <Link to={'/'}>
        <span>Movies<span className='text-white'>Dhamaka</span></span>
      </Link>
      
      {useAppState.login?
      <Link to={"/addmovie"}>
        <h1 className='text-lg flex items-center cursor-pointer'>
        <Button><AddIcon className='mr-2' color='warning'/> <span className='text-white'>Add Movie</span></Button>
        </h1>
      </Link>
      :
      <Link to={"/login"}>
        <h1 className='text-lg flex items-center cursor-pointer bg-orange-500'>
        <Button><span className='text-white'>Login</span></Button>
        </h1>
      </Link>
      }
    </div>
  )
}

export default Header
