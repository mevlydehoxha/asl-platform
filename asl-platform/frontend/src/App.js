import {React, Suspense, lazy, useEffect, useState} from 'react';
import './App.scss';
import {   BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Loading from './components/shared/Loading/Loading'
import { IntlProvider } from 'react-intl';
import {translate} from './translation/translate';
import {useSelector} from 'react-redux';

const Home = lazy(() => import('./components/Home/Home'));
const Register = lazy(() => import('./components/Auth/Register'));
const Login = lazy(() => import('./components/Auth/Login'));
const Admin = lazy(() => import('./components/Admin/Admin'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword/ForgotPassword'));
const HomeAdmin = lazy(() => import('./components/HomeAdmin/HomeAdmin'));
const Category = lazy(() => import('./components/HomeAdmin/Category/Category'));
const EditCategoryModal = lazy(() => import('./components/HomeAdmin/Category/EditCategory/EditCategory'));
const CategoryModal = lazy(() => import('./components/HomeAdmin/Category/CategoryModal/CreateCategory'));
const CreateVideo = lazy(() => import('./components/HomeAdmin/Videos/CreateVideo/CreateVideo'));
const EditVideo = lazy(() => import('./components/HomeAdmin/Videos/EditVideo/EditVideo'));
const Edit = lazy(() => import('./components/Admin/Edit/Edit'));
const NewsAdmin = lazy(() => import('./components/NewsAdmin/NewsAdmin'));
const CreateNews = lazy(() => import('./components/NewsAdmin/CreateNews/CreateNews'));
const EditNews = lazy(() => import('./components/NewsAdmin/EditNews/EditNews'));
const FrontPageItem = lazy(() => import('./components/Home/FrontPageItem/FrontPageItem'));
const Donations = lazy(() => import('./components/Donations/Donations'));
const News = lazy(() => import('./components/News/News'));
const NewsItem = lazy(() => import('./components/News/NewsItem/NewsItem'));
const Type = lazy(() => import('./components/Donations/Type/Type'));
const CreateType = lazy(() => import('./components/Donations/Type/TypeModal/CreateType'));
const EditType = lazy(() => import('./components/Donations/Type/EditType/EditType'));
const DonationsAdmin = lazy(() => import('./components/DonationsAdmin/DonationsAdmin'));
const DonationItem = lazy(() => import('./components/DonationsAdmin/DonationsItem/DonationItem'));
const HandRecognition = lazy(() => import('./components/HandRecognition/HandRecognition'));
const NotFound = lazy(() => import('./components/shared/NotFound/NotFound'));

function App() {

  const language = useSelector((state) => state.language.language);
  return (
    <div className='app'>
       <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <IntlProvider
              locale={language}
              formats={{ number: 'en' }}
              messages={translate[language]}
            >
              <Routes>
              <Route exact path='/' element={<Home/>}/>
              <Route path='/register' element={<Register/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/home' element={<Home/>}/>
              <Route path='/admin' element={<Admin/>} />
              <Route path='/edit/:id' element={<Edit/>} />
              <Route path='/forgot-password' element={<ForgotPassword/>} />
              <Route path='/home-admin' element={<HomeAdmin/>} />
              <Route path='/create-video' element={<CreateVideo/>} />
              <Route path='/video-edit/:id' element={<EditVideo/>} />
              <Route path='/category' element={<Category/>} />
              <Route path='/create-category' element={<CategoryModal />} />
              <Route path='/category-edit/:id' element={<EditCategoryModal/>} />
              <Route path='/news-admin' element={<NewsAdmin/>} />
              <Route path='/create-news' element={<CreateNews/>} />
              <Route path='/news-edit/:id' element={<EditNews/>} />
              <Route path='/item/:id' element={<FrontPageItem/>} />
              <Route path='/donations' element={<Donations/>} />
              <Route path='/news' element={<News/>} />
              <Route path='/news-item/:id' element={<NewsItem/>} />
              <Route path='/type' element={<Type/>} />
              <Route path='/create-type' element={<CreateType/>} />
              <Route path='/edit-type/:id' element={<EditType/>} />
              <Route path='/donations-admin' element={<DonationsAdmin/>} />
              <Route path='/donations/:id' element={<DonationItem/>} />
              <Route path='/hand-recognition' element={<HandRecognition/>} />
              <Route path='*' element={<NotFound/>}/>
            </Routes>
          </IntlProvider>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
