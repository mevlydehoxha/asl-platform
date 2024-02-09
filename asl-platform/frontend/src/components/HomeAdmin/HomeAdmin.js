import React, { useEffect, useState } from 'react';
import useAuth from '../Auth/useAuth';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from '../shared/SideBar/SideBar'
import './HomeAdmin.scss'
import Pagination from 'react-js-pagination';
import DeleteVideo from './Videos/DeleteVideo/DeleteVideo';
import NotFound from '../shared/NotFound/NotFound';
import Loading from '../shared/Loading/Loading';
import { FormattedMessage } from 'react-intl';

const HomeAdmin = () => {
  const [role, setRole] = useState({});
  const [signs, setSigns] = useState()
  const [deletedSignId, setDeletedSignId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [firstname, setFirstname] = useState({});
  const [lastname, setLastname] = useState({});
  const [categoryNames, setCategoryNames] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const isAuthenticated = useAuth();
  const navigate = useNavigate(); 
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
    axios.get('http://localhost:8000/api/signs')
      .then((response) => {
        const signsWithSortableId = response.data.map((sign, index) => ({
          ...sign,
          sortableId: index + 1,
        }));
        setSigns(signsWithSortableId);
        setIsLoading(false);
  
        const categoryIds = signsWithSortableId.map((sign) => sign.category_id);
        axios.get(`http://localhost:8000/api/categories?id=${categoryIds.join(',')}`)
          .then((categoryResponse) => {
            const categoryMap = {};
            categoryResponse.data.forEach((category) => {
              categoryMap[category.id] = category.name;
            });
            setCategoryNames(categoryMap);
          })
          .catch((error) => {
            console.error('Error fetching category data:', error)
            setIsLoading(false);
          }
        );
      })
    .catch((error) => 
      console.log('An error occurred. Our team has been notified.')
    );
  }, [deletedSignId]);



   const [activePage, setActivePage] = useState(1);
   const itemsPerPage = 4; 
 
   const startIndex = (activePage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;

   const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);

    if (searchQuery !== '') {
      setSearchQuery('');
    }
  };  
  const handleData = (data) => {
    setDeletedSignId(data);
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

  const filteredSigns = signs ? signs.filter((sign) =>
    sign.title_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sign.title_albanian.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sign.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (isLoading) {
    return <Loading />; 
  }
  if(isAuthenticated && role==='admin'){
    return (
    <div className='home-admin'>
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
              <div className='home-buttons'>
                <Link to='/create-video'><button><FormattedMessage id="home6"/></button></Link>
                <Link to='/category'><button><FormattedMessage id="home7"/></button></Link>
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
                <div className='table-item videos id'>
                  <h3>ID</h3>
                </div>
                <div className='table-item videos'>
                  <h3><FormattedMessage id="home1"/></h3>
                </div>
                <div className='table-item videos'>
                  <h3>Video</h3>
                </div>
                <div className='table-item videos'>
                  <h3><FormattedMessage id="home2"/></h3>
                </div>
                <div className='table-item videos'>
                  <h3><FormattedMessage id="home3"/></h3>
                </div>
                <div className='table-item videos'>
                  <h3><FormattedMessage id="home4"/></h3>
                </div>
                <div className='table-item videos'>
                  <h3><FormattedMessage id="home5"/></h3>
                </div>
                <h3 className='table-item videos'><FormattedMessage id="admin4" defaultMessage='Actions'/></h3>
              </div>
              <div className='response-table'>
              {filteredSigns.slice(startIndex, endIndex).map((sign) => (
                <div className='responses videos-item'  key={sign.id}>
                  <p className='response-item videos id'>{sign.id}</p>
                  <p className='response-item videos'>{categoryNames[sign.category_id]}</p>
                  <video controls className='response-item videos'>
                    <source src={`http://localhost:8000/storage/${sign.video}`} type="video/mp4" className='response-item videos'/>
                    Your browser does not support the video tag.
                  </video>
                  <img src={`http://localhost:8000/storage/${sign.image}`} alt={sign.title_english} className='response-item videos'/>
                  <p className='response-item videos'>{sign.title_albanian}</p>
                  <p className='response-item videos'>{sign.title_english}</p>
                  <p className='response-item videos'>{sign.description}</p>
                  <div className='response-item videos'>
                    <div className='actions'>
                      <Link to={`/video-edit/${sign.id}`}><div className='edit'></div></Link> 
                      <div className='delete' onClick={()=>handleDelete(sign.id)}></div>
                      <DeleteVideo isOpen={showModal} onClose={handleModalClose} id={sign.id} setDeletedSignId={handleData} selectedId ={selectedId}/> 
                    </div>
                  </div>
                </div>
              ))}
              {filteredSigns.length===0 ? <h2 className='error-message'>Opps, seems like there is no data!</h2>: ''}
              </div>
            </div>
          </div>
          <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={filteredSigns.length}
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

export default HomeAdmin;
