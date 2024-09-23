// import React, { useState } from 'react'; // Импортируйте React и useState

import Footer from "../components/Footer";
import Header from "../components/Header";
import MainContent from "../components/MainContent";


const Home = () => {
  

  return (
    <div className='app'>
     <Header></Header>
      <MainContent></MainContent>
     <Footer></Footer>
    </div>
  );
};

export default Home;
