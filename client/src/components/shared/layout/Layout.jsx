
import Navbar from './Navbar.jsx'

const Layout = ({children}) => {
  return (
    <div>
      <div className="header"><Navbar></Navbar></div>
      <div className="content">{children}</div>
    </div>
  )
}

export default Layout