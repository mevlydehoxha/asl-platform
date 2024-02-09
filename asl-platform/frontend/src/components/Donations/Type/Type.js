import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../../shared/SideBar/SideBar';
import useAuth from '../../Auth/useAuth';
import './Type.scss'
import Pagination from 'react-js-pagination';
import DeleteTypeModal from './DeleteTypeModal/DeleteTypeModal';
import NotFound from '../../shared/NotFound/NotFound';
import Loading from '../../shared/Loading/Loading';
import { FormattedMessage } from 'react-intl';

const Type = () => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate(); 
  const [role, setRole] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [type, setType] = useState([]);
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
    axios.get('http://localhost:8000/api/type')
        .then(response => {
            setType(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.log('An error occurred. Our team has been notified.');
            setIsLoading(false);
        });
  };

    useEffect(() => {
        fetchCategories();
    }, [deletedUserId]); 

    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 5; 
  
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
    const filteredCategories = type ? type.filter((typeItem) =>
    typeItem.type.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <Link to="/create-type"><button><FormattedMessage id="home6"/></button></Link>
                </div>
               </div>
              <div className='logged-in'>
                <div className='initials'>{firstname.charAt(0)}{lastname.charAt(0)}</div>
                <div>{firstname} {lastname}</div>
              </div>
            </div>
              <div className='table-items'>
                <div className='table-item id'><h3>ID</h3></div>
                <div className='table-item'><h3><FormattedMessage id="home11"/></h3></div>
                <div className='table-item'><h3><FormattedMessage id="admin4" defaultMessage='Actions'/></h3></div>
              </div>
              <div className='response-table'>
                {filteredCategories.slice(startIndex, endIndex).map(type => (
                    <div className='responses' key={type.id}>
                      <div className='response-item id'>{type.id}</div>
                      <div className='response-item'>{type.type}</div>
                      <div className='response-item '>
                      <div className='actions'>
                        <Link to={`/edit-type/${type.id}`}><div className='edit'></div></Link> 
                        <div className='delete' onClick={()=>handleDelete(type.id)}></div>
                        <DeleteTypeModal 
                        isOpen={showModal} 
                        onClose={handleModalClose} 
                        id={type.id} 
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
              totalItemsCount={type.length}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass='page-item'
              linkClass='page-link'
              hideFirstLastPages={true}
            />
        </div>
      </div>
    );
  }
  else{
    return(
      <NotFound/>
    )
  }
};

export default Type;
