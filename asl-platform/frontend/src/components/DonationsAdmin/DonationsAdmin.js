import React, { useEffect, useState } from 'react';
import useAuth from '../Auth/useAuth';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../shared/SideBar/SideBar'
import './DonationsAdmin.scss'
import Pagination from 'react-js-pagination';
import debounce from 'lodash.debounce';
import NotFound from '../shared/NotFound/NotFound';
import Loading from '../shared/Loading/Loading';
import { FormattedMessage } from 'react-intl';

const DonationsAdmin = () => {
  const [role, setRole] = useState({});
  const [donations, setDonations] = useState()
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [firstname, setFirstname] = useState({});
  const [lastname, setLastname] = useState({});
  const [typeNames, setTypeNames] = useState({});
  const [usersNames, setUsersNames] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const isAuthenticated = useAuth();
  const navigate = useNavigate(); 
  const [checkedItems, setCheckedItems] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
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
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/api/donations')
      .then((response) => {
        const donationsWithSortableId = response.data.map((donation, index) => ({
          ...donation,
          sortableId: index + 1,
        }));
        setDonations(donationsWithSortableId);
        setIsLoading(false);
  
        const typeIds = donationsWithSortableId.map((donation) => donation.type_id);
        axios.get(`http://localhost:8000/api/type?id=${typeIds.join(',')}`)
          .then((typeResponse) => {
            const typeMap = {}; 
            typeResponse.data.forEach((type) => {
              typeMap[type.id] = type.type;
            });
            setTypeNames(typeMap);
          })
          .catch((error) => {
            console.log('An error occurred. Our team has been notified.'); 
            setIsLoading(false);
          }
        );
        
        const userIds = donationsWithSortableId.map((donation) => donation.user_id);
        axios.get(`http://localhost:8000/api/index?id=${userIds.join(',')}`)
          .then((usersResponse) => {
            const usersMap = {};
            usersResponse.data.forEach((user) => {
              usersMap[user.id] = {
                firstname: user.firstname,
                lastname: user.lastname,
              };
            });
            setUsersNames(usersMap);
          })
          .catch((error) => console.error('Error fetching users data:', error));
          const completedMap = {};
          donationsWithSortableId.forEach((donation) => {
            completedMap[donation.id] = donation.completed === 1;
          });
        
          setCheckedItems(completedMap);
      })
      
    .catch((error) => 
      console.log('An error occurred. Our team has been notified.')
    );
      
  }, []);


   const [activePage, setActivePage] = useState(1);
   const itemsPerPage = 3; 
 
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

  const filteredDonations = donations ? donations.filter((donation) =>
    donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleCheckboxChange = async (itemId, isChecked) => {
    setLoadingItems((prevLoadingItems) => ({
      ...prevLoadingItems,
      [itemId]: true,
    }));
  
    try {
      await axios.put(`http://localhost:8000/api/donations/${itemId}/completed`, {
        completed: isChecked ? 1 : 0,
      });
      setCheckedItems((prevCheckedItems) => ({
        ...prevCheckedItems,
        [itemId]: isChecked,
      }));
    } catch (error) {
      console.error('Error updating checkbox data:', error);
    } finally {
      setLoadingItems((prevLoadingItems) => ({
        ...prevLoadingItems,
        [itemId]: false,
      }));
    }
  };

  const debouncedHandleCheckboxChange = debounce(handleCheckboxChange, 300);
  
  if (isLoading) {
    return <Loading />; 
  }
  if(isAuthenticated && role==='admin'){
    return (
    <div className='donations-admin'>
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
              <Link to='/type'><button><FormattedMessage id="home11"/></button></Link>
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
                </div>
                <div className='table-item'>
                  <h3><FormattedMessage id="home1"/></h3>
                </div>
                <div className='table-item'>
                  <h3><FormattedMessage id="admin1"/></h3>
                </div>
                <div className='table-item'>
                  <h3><FormattedMessage id="admin2"/></h3>
                </div>
                <div className='table-item'>
                  <h3><FormattedMessage id="donation3"/></h3>
                </div>
                <div className='table-item'>
                  <h3><FormattedMessage id="home5"/></h3>
                </div>
                <div className='table-item'>
                  <h3><FormattedMessage id="donation4"/></h3>
                </div>
              </div>
              <div className='response-table'>
              {filteredDonations.slice(startIndex, endIndex).map((donation) => (
                <div className='responses'  key={donation.id}>
                  <p className='response-item  id'>{donation.id}</p>
                  <p className='response-item '>{typeNames[donation.type_id]}</p>
                  <p className='response-item '>{usersNames[donation.user_id]?.firstname}</p>
                  <p className='response-item '>{usersNames[donation.user_id]?.lastname}</p>
                  <p className='response-item '>{donation.title}</p>
                  <p className='response-item '>{donation.description}</p>
                  <div className='response-item'>
                  <div className='actions'>
                      <label className="main">
                        <input
                        type="checkbox"
                        checked={checkedItems[donation.id] || false}
                        onChange={(e) => debouncedHandleCheckboxChange(donation.id, e.target.checked)}
                        disabled={loadingItems[donation.id]}/>
                        <span className="span"></span>
                      </label>
                      <Link to={`/donations/${donation.id}`}><div className='read'></div></Link> 
                    </div>
                  </div>
                </div>
              ))}
              {filteredDonations.length===0 ? <h2 className='error-message'>Opps, seems like there is no data!</h2>: ''}
              </div>
            </div>
          </div>
          <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={filteredDonations.length}
            pageRangeDisplayed={5}
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

export default DonationsAdmin;
