import {React, useEffect, useState} from 'react';
import useAuth from '../Auth/useAuth';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Admin.scss'
import Pagination from 'react-js-pagination';
import SideBar from '../shared/SideBar/SideBar';
import DeleteModal from './DeleteModal/DeleteModal';
import NotFound from '../shared/NotFound/NotFound'
import Loading from '../shared/Loading/Loading';
import {FormattedMessage} from 'react-intl'



const Admin = () => {
  const [firstname, setFirstname] = useState({});
  const [lastname, setLastname] = useState({});
  const [role, setRole] = useState({});
  const [users, setUsers] = useState()
  const [deletedUserId, setDeletedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('firstname');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useAuth();

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
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/api/index')
      .then((response) => {
        const usersWithSortableId = response.data.map((user, index) => ({
          ...user,
          sortableId: index + 1,
        }));
  
        setUsers(usersWithSortableId);
        setIsLoading(false);
      })
      .catch((error) =>{
        console.log('An error occurred. Our team has been notified.');
        setIsLoading(false); 
        }
      );
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
  
  const handleData = (data) => {
    setDeletedUserId(data);
  };
  const handleDelete = (id) => {
    setSelectedId(id); 
    setShowModal(true)
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users ? users.filter((user) =>
    user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  

  const sortedUsers = filteredUsers.slice().sort((a, b) => {
    if (sortColumn === 'id') {
      const aValue = a.sortableId;
      const bValue = b.sortableId;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      const aValue = a[sortColumn].toLowerCase();
      const bValue = b[sortColumn].toLowerCase();
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
  });
  if (isLoading) {
    return <Loading />; 
  }
  if(isAuthenticated && role==='admin'){
    return (
      <div className='admin'>
        <div className='dashboard'>
          <SideBar/>
          <div className='table'>
            <div className='dashboard-header'>
              <div className='filters'>
                <div className='search'>
                <input
                  type="search"
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={handleSearch}
                />
                </div>
              </div>
              <div className='logged-in'>
                <div className='initials'>{firstname.charAt(0)}{lastname.charAt(0)}</div>
                <div>{firstname} {lastname}</div>
              </div>
            </div>
            <div className='outter-table'>
              <div className='inner-table'>
                <div className='table-items'>
                  <div className='table-item id'>
                    <h3>ID</h3>
                    <div className='sort' onClick={() => handleSort('id')}></div>
                  </div>
                  <div className='table-item'>
                    <h3><FormattedMessage id="admin1"/></h3>
                    <div className='sort' onClick={() => handleSort('firstname')}></div>
                  </div>
                  <div className='table-item'>
                    <h3><FormattedMessage id="admin2"/></h3>
                    <div className='sort' onClick={() => handleSort('lastname')}></div>
                  </div>
                  <div className='table-item'>
                    <h3>Email</h3>
                    <div className='sort' onClick={() => handleSort('email')}></div>
                  </div>
                  <div className='table-item'>
                    <h3><FormattedMessage id="admin3"/></h3>
                    <div className='sort' onClick={() => handleSort('role')}></div>
                  </div>
                  <h3 className='table-item'><FormattedMessage id="admin4"/></h3>
                </div>
                <div className='response-table'>
                  {sortedUsers.slice(startIndex, endIndex).map((user) => (
                    <div className='responses'  key={user.id}>
                      <p className='response-item id'>{user.id}</p>
                      <p className='response-item'>{user.firstname}</p>
                      <p className='response-item'>{user.lastname}</p>
                      <p className='response-item'>{user.email}</p>
                      <div className='response-item'>
                        <div className={user.role==='admin' ? 'role-admin' : 'role-user'}>{user.role}</div>
                      </div>
                      <div className='response-item'>
                        <div className='actions'>
                         {user.email==='admin@platform.com' ? '' :
                         <>
                            <Link to={`/edit/${user.id}`}><div className='edit'></div></Link>
                            <div className='delete' onClick={()=>handleDelete(user.id)}></div>
                            <DeleteModal isOpen={showModal} onClose={handleModalClose} id={user.id} setDeletedUserId={handleData} selectedId={selectedId}/>
                         </> }
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length===0 ? <h2 className='error-message'>Opps, seems like there is no data!</h2>: ''}
                </div>
              </div>
            </div>
            <Pagination
              activePage={activePage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={filteredUsers.length}
              pageRangeDisplayed={3}
              onChange={handlePageChange}
              itemClass='page-item'
              linkClass='page-link'
              hideFirstLastPages={true}
            />
          </div>
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

export default Admin;
