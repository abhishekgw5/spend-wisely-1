import React from 'react'
import Header from './Header'
import Footer from './Footer'
import '../../styles/homePageStyle.css';

const Layout = ({children}) => {
  return (
    <>
        <Header/>
        <div className='content'>
            {children}
        </div>
        <Footer/>
    </>
  )
}

export default Layout