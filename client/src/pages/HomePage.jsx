import React ,{useEffect} from 'react'
import { useSelector } from 'react-redux'
import Spinner from '../components/shared/Spinner'

const HomePage = () => {
  const{loading,error}=useSelector(state => state.auth)
   useEffect(() => {
      if (error) {
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
    }, [error]);
  return (
    <div>
      
      {loading ? (<Spinner/> ):(
        <>
        <h1>Home Page</h1>
        </>
      )}
    
    </div>
  )
}

export default HomePage