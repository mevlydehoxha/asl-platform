
import Cookies from 'js-cookie';
import { redirect } from 'react-router-dom';

const Logout = () => {
  Cookies.remove('token');
  redirect('/login')
};

export default Logout;
