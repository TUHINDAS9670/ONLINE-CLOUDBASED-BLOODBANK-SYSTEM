import React from 'react'
import Layout from '../../components/shared/layout/Layout'
import { useSelector } from 'react-redux'

const AdminHomePage = () => {
  const{user}=useSelector(state=>state.auth)
  return (
    <Layout>
    <div className="mt-[100px] ">
      <h1>Welcome Admin <i>{user?.name}</i></h1>
    </div>
  </Layout>
  )
}

export default AdminHomePage