import React from 'react';
import Nev from './Nev';
import AnimatedCart from './AnimatedCard';
import Footer from './Footer';
import TrendingItems from './TrendingItems';
import Categories from './Categories';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = React.useContext(AuthContext);

  return (
    <div>
      <Nev />
      <AnimatedCart />

      {user?.role !== "admin" ? <TrendingItems /> : null}

      {user?.role !== "admin" ? <Categories /> : null}

      <Footer />
    </div>
  );
};

export default Home;
