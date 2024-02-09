import { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar/Navbar'
import './News.scss'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { FormattedMessage } from 'react-intl';
import Footer from '../shared/Footer/Footer'


const News = () => {
    const [news, setNews] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 6; 

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/news')
            .then((response) => {
                setNews(response.data)
            })
            .catch((error) => {
                console.log('An error occurred. Our team has been notified.');
            });
      }, []);
      const startIndex = (activePage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
   
      const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
      }
    return(
        <div>
            <Navbar/>
            <div className='news'>
                <div className='news-cards'>
                    {news.map((newsItem)=>{
                        return(
                            <div className='news-card' key={newsItem.id}>
                                <img src={`http://localhost:8000/storage/${newsItem.image}`} alt={newsItem.title}/>
                                <div className='news-text'>
                                    <h3>{newsItem.title}</h3>
                                    <p>{newsItem.description}</p>
                                    <Link to={`/news-item/${newsItem.id}`} className='read-more'>
                                        <FormattedMessage id="read-more"/> <div className='right-arrow'></div>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
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
            <Footer/>
        </div>
    )
};

export default News;
