import React ,{useEffect} from 'react'
import { useSelector } from 'react-redux'
import Spinner from '../components/shared/Spinner'
import Layout from '../components/shared/layout/Layout'

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
   <Layout>
     <div>
      
      {loading ? (<Spinner/> ):(
        <>
        <h1>Home Page</h1>
        </>
      )}
    
    </div>
   </Layout>
  )
}

export default HomePage