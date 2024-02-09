import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../../shared/SideBar/SideBar';
import useAuth from '../../Auth/useAuth';
import './Category.scss'
import Pagination from 'react-js-pagination';
import DeleteCategoryModal from './DeleteCategoryModal/DeleteCategoryModal';
import Loading from '../../shared/Loading/Loading';
import { FormattedMessage } from 'react-intl';

const Category = () => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate(); 
  const [role, setRole] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletedUserId, setDeletedUserId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) { 
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get('http://localhost:8000/api/user')
        .then((response) => {
          setRole(response.data.user.role)
          setFirstname(response.data.user.firstname)
          setLastname(response.data.user.lastname)
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
          setIsLoading(false);
        });
    }
  }, []);

  const handleModal = () => {
    setShowModal(true)
  };
  const handleModalClose = () => {
    setShowModal(false);
  }; 

  
  const fetchCategories = () => {
    axios.get('http://localhost:8000/api/categories')
        .then(response => {
            setCategories(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error(error);
            setIsLoading(false);
        });
  };

    useEffect(() => {
        fetchCategories();
    }, [deletedUserId]); 

    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 8; 
  
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handlePageChange = (pageNumber) => {
      setActivePage(pageNumber);
      if (searchQuery !== '') {
        setSearchQuery('');
      }
    };  
    const handleSearch = (event) => {
      setSearchQuery(event.target.value);
    };
    const filteredCategories = categories ? categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const handleData = (data) => {
      setDeletedUserId(data);
    };
    const handleDelete = (id) => {
      setSelectedId(id); 
      setShowModal(true)
    };

  if (isLoading) {
    return <Loading />; 
  }
  if(isAuthenticated && role==='admin'){
    return (
      <div className='category'>
        <SideBar/>
        <div>
            <div className='table'>
            <div className='dashboard-header'>
              <div className='filters'>
               <div className='filters-2'>
                <div className='search'>
                  <input
                    type="search"
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  </div>
                  <Link to="/create-category"><button><FormattedMessage id='home6'/></button></Link>
                </div>
               </div>
              <div className='logged-in'>
                <div className='initials'>{firstname.charAt(0)}{lastname.charAt(0)}</div>
                <div>{firstname} {lastname}</div>
              </div>
            </div>
              <div className='table-items'>
                <div className='table-item id'><h3>ID</h3></div>
                <div className='table-item'><h3><FormattedMessage id='name'/></h3></div>
                <div className='table-item'><h3><FormattedMessage id='admin4'/></h3></div>
              </div>
              <div className='response-table'>
                {filteredCategories.slice(startIndex, endIndex).map(category => (
                    <div className='responses' key={category.id}>
                      <div className='response-item id'>{category.id}</div>
                      <div className='response-item'>{category.name}</div>
                      <div className='response-item '>
                      <div className='actions'>
                        <Link to={`/category-edit/${category.id}`}><div className='edit'></div></Link> 
                        <div className='delete' onClick={()=>handleDelete(category.id)}></div>
                        <DeleteCategoryModal 
                        isOpen={showModal} 
                        onClose={handleModalClose} 
                        id={category.id} 
                        setDeletedUserId={handleData}
                        selectedId ={selectedId} /> 
                      </div>
                    </div>
                    </div>
                ))}
              </div>
            </div>
            <Pagination
              activePage={activePage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={categories.length}
              pageRangeDisplayed={10}
              onChange={handlePageChange}
              itemClass='page-item'
              linkClass='page-link'
              hideFirstLastPages={true}
            />
        </div>
      </div>
    );
  }
};

export default Category;
