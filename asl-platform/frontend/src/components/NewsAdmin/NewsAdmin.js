import React, { useEffect, useState } from 'react';
import useAuth from '../Auth/useAuth';
import Cookies from 'js-cookie';
import axios from 'axios';
import SideBar from '../shared/SideBar/SideBar'
import './News.scss'
import Pagination from 'react-js-pagination';
import { Link, useNavigate } from 'react-router-dom';
import DeleteNews from './DeleteNews/DeleteNews';
import Loading from '../shared/Loading/Loading';
import { FormattedMessage } from 'react-intl';

const  NewsAdmin = () => {
  const [role, setRole] = useState({});
  const [news, setNews] = useState([])
  const [deletedNewsId, setDeletedNewsId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('firstname');
  const [sortDirection, setSortDirection] = useState('asc');
  const [firstname, setFirstname] = useState({});
  const [lastname, setLastname] = useState({});
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
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, []);
  
  useEffect(() => {
    axios.get('http://localhost:8000/api/news')
      .then((response) => {
        if (Array.isArray(response.data)) {
          const newsWithSortableId = response.data.map((news, index) => ({
            ...news,
            sortableId: index + 1,
          }));
  
          setNews(newsWithSortableId);
          setIsLoading(false);
        }
      })
      .catch((error) => 
        {
          console.error('Error fetching data:', error)
          setIsLoading(false);
        }
      );
  }, [deletedNewsId]);
  

  const isAuthenticated = useAuth();
  const navigate = useNavigate(); 

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login')
  }



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
    setDeletedNewsId(data);
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

  const filteredNews = news
  ? news.filter((newsItem) =>
      (newsItem.title && newsItem.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (newsItem.description && newsItem.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (newsItem.others && newsItem.others.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  : [];

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  

  const sortedNews = filteredNews.slice().sort((a, b) => {
    if (sortColumn === 'id') {
      const aValue = a.sortableId;
      const bValue = b.sortableId;
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      const aValue = a[sortColumn] ? a[sortColumn].toLowerCase() : '';
      const bValue = b[sortColumn] ? b[sortColumn].toLowerCase() : '';      
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
  });

    
  if (isLoading) {
    return <Loading />; 
  }
  if(isAuthenticated && role==='admin'){
    return (
      <div className='news-admin'>
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
              <Link to='/create-news'><button><FormattedMessage id="home6"/></button></Link>
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
                  <div className='sort' onClick={() => handleSort('id')}></div>
                </div>
                <div className='table-item videos'>
                  <h3>Video</h3>
                </div>
                <div className='table-item videos'>
                  <h3><FormattedMessage id="home2"/></h3>
                </div>
                <div className='table-item videos'>
                  <h3><FormattedMessage id="news1"/></h3>
                  <div className='sort' onClick={() => handleSort('title')}></div>
                </div>
                <div className='table-item videos'>
                  <h3><FormattedMessage id="home5"/></h3>
                  <div className='sort' onClick={() => handleSort('description')}></div>
                </div>
                <div className='table-item videos'>
                  <h3><FormattedMessage id="news2"/></h3>
                  <div className='sort' onClick={() => handleSort('others')}></div>
                </div>
                <h3 className='table-item videos'><FormattedMessage id="admin4" defaultMessage='Actions'/></h3>
              </div>
              <div className='response-table'>
              {sortedNews.slice(startIndex, endIndex).map((news) => (
                <div className='responses videos-item'  key={news.id}>
                  <p className='response-item videos id'>{news.id}</p>
                  <video controls className='response-item videos'>
                    <source src={`http://localhost:8000/storage/${news.video}`} type="video/mp4" className='response-item videos'/>
                    Your browser does not support the video tag.
                  </video>
                  <div>
                  <img src={`http://localhost:8000/storage/${news.image}`} alt={news.title} className='response-item videos'/>
                  </div>
                  <p className='response-item videos'>{news.title}</p>
                  <p className='response-item videos'>{news.description}</p>
                  <p className='response-item videos'>{news.others}</p>
                  <div className='response-item videos'>
                    <div className='actions'>
                      <Link to={`/news-edit/${news.id}`}><div className='edit'></div></Link> 
                      <div className='delete' onClick={()=>handleDelete(news.id)}></div>
                      <DeleteNews isOpen={showModal} onClose={handleModalClose} id={news.id} setDeletedNewsId={handleData} selectedId ={selectedId}/> 

                    </div>
                  </div>
                </div>
              ))}
              {filteredNews.length===0 ? <h2 className='error-message'>Opps, seems like there is no data!</h2>: ''}
              </div>
            </div>
          </div>
          <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={news.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass='page-item'
            linkClass='page-link'
            hideFirstLastPages={true}
          />
        </div>
      </div>
    )
  }
};

export default NewsAdmin;
