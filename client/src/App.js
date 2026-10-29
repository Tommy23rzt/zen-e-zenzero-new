import { useState } from 'react';

import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

//components
import DataProvider from './context/DataProvider';
import { ColorModeProvider } from './context/ColorModeContext';
import Header from './components/header/Header';
import Home from './components/home/Home';
import CreatePost from './components/create/CreatePost';
import DetailView from './components/details/DetailView';
import Update from './components/create/Update';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Login from './components/account/Login';
import Footer from './components/footer/Footer';

const PageLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const PrivateRoute = ({ isAuthenticated }) => {
  const token = sessionStorage.getItem('accessToken');
  return isAuthenticated && token ? <PageLayout /> : <Navigate replace to='/login' />;
};

function App() {

  const [isAuthenticated, isUserAuthenticated] = useState(() => Boolean(sessionStorage.getItem('accessToken')));

  return (
    <ColorModeProvider>
      <DataProvider>
        <BrowserRouter>
          <Box sx={{ marginTop: { xs: '72px', sm: '84px', md: '116px', lg: '140px' } }}>
            <Routes>
              <Route path='/login' element={<Login isUserAuthenticated={isUserAuthenticated} />} />

              <Route element={<PageLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/details/:id' element={<DetailView />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
              </Route>

              <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                <Route path='/create' element={<CreatePost />} />
                <Route path='/update/:id' element={<Update />} />
              </Route>

              <Route path='*' element={<Navigate replace to='/' />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </DataProvider>
    </ColorModeProvider>
  );
}

export default App;