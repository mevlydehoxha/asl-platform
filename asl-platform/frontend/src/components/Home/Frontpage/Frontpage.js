import React, { useEffect, useState } from 'react';
import './Frontpage.scss'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import annyang from 'annyang'
import { FormattedMessage } from 'react-intl';
import Loading from '../../shared/Loading/Loading';
import HoverVideoPlayer from 'react-hover-video-player';


const Frontpage = () => {
    const [signs ,setSigns] = useState([])
    const [categoryNames, setCategoryNames] = useState({});
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 12; 
    const [searchQuery, setSearchQuery] = useState('');
    const [voiceQuery, setVoiceQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
 
    const handlePageChange = (pageNumber) => {
      setActivePage(pageNumber);
      if (searchQuery !== '') {
        setSearchQuery('');
      }
    }
    useEffect(() => {
          axios
            .get('http://localhost:8000/api/signs')
            .then((response) => {
              const signsWithSortableId = response.data.map((sign, index) => ({
                ...sign,
                sortableId: index + 1,
              }));
              setSigns(signsWithSortableId);
              setIsLoading(false);

              const categoryIds = signs.map((sign) => sign.category_id);
              axios.get(`http://localhost:8000/api/categories?id=${categoryIds.join(',')}`)
                .then((categoryResponse) => {
                  const categoryMap = {};
                  categoryResponse.data.forEach((category) => {
                    categoryMap[category.id] = category.name;
                  });
                  setCategoryNames(categoryMap);
                })

            })
            .catch((error) => {
              console.log('An error occurred. Our team has been notified.');
            });
      }, []);

      const handleSearch = (event) => {
        const newText = event.target.value;
        setSearchQuery(newText);
        if (isListening) {
          setVoiceQuery(newText);
        }
      };
      
      useEffect(() => {
        if (annyang) {
          const commands = {
            '*query': handleVoiceSearch,
          };
          annyang.addCommands(commands);
          if (isListening) {
            annyang.start();
          } else {
            annyang.abort();
          }
        }
      }, [isListening]);

      const activateVoice = () => {
        if (isListening) {
          annyang.abort();
        } else {
          annyang.start(); 
        }
        setIsListening(!isListening); 
      };
  
      const handleVoiceSearch = (query) => {
        setSearchQuery(query);
        setVoiceQuery(query);
      };

      const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setSearchQuery('');
        setVoiceQuery('');
        setActivePage(1);
      };
       
      
      const filteredSigns = signs
      ? signs.filter((sign) =>
          (selectedCategory === null || sign.category_id === parseInt(selectedCategory)) &&
            (voiceQuery
              ? sign.title_english.toLowerCase().includes(voiceQuery.toLowerCase()) ||
                sign.description.toLowerCase().includes(voiceQuery.toLowerCase())
              : sign.title_english.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sign.title_albanian.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sign.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
      : [];
      if (isLoading) {
        return <Loading />; 
      }
      else {
        return (
          <div>
            <div className='frontpage'>
              <div className='header'>
                <div className='searchbar'>
                  <input
                    type="search"
                    placeholder='Search...'
                    value={isListening ? voiceQuery : searchQuery}
                    onChange={handleSearch}
                  />
                  <button onClick={activateVoice}>
                    {isListening ?  <FormattedMessage id="deactivate"/> : <FormattedMessage id="activate"/>}
                  </button>
                </div>
                <select
                    value={selectedCategory || ''}
                    onChange={(e) => handleCategorySelect(e.target.value !== '' ? e.target.value : null)}
                  >
                    <option value=""><FormattedMessage id="cat"/></option>
                    {Object.entries(categoryNames).map(([categoryId, categoryName]) => (
                      <option key={categoryId} value={categoryId}>
                        {categoryName}
                      </option>
                    ))}
                  </select>
              </div>
              <div className='signs'>
                {filteredSigns.slice(startIndex, endIndex).map((sign) => (
                    <div className='sign' key={sign.id}>
                        <Link to={`/item/${sign.id}`}>
                          {/* <video loop muted autoplay id={sign.id} 
                              onMouseOut={e => e.target.pause()} 
                              onMouseOver={e => e.target.play()}
                              >
                              <source src={`http://localhost:8000/storage/${sign.video}`}type="video/mp4"/>
                          </video> */}
                          <HoverVideoPlayer id={sign.id} className='personalized-video' videoSrc={`http://localhost:8000/storage/${sign.video}`} />
                        </Link>
                        <h3>{sign.title_english}</h3>
                        <div className='on-hover'>
                            <img src={`http://localhost:8000/storage/${sign.image}`} alt={sign.title_english}/>
                            <div className='inner-text'>
                                <p className='long-text'>{sign.description}</p>
                                <p className='category'>Category - <span>{categoryNames[sign.category_id]}</span></p> 
                                <Link to={`/item/${sign.id}`} className='read-more'>Read More <div className='right-arrow'></div></Link>
                            </div>
                        </div>
                    </div>
                ))}
              </div>
            </div>
            <Pagination
                  activePage={activePage}
                  itemsCountPerPage={itemsPerPage}
                  totalItemsCount={signs.length}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                  itemClass='page-item'
                  linkClass='page-link'
                  hideFirstLastPages={true}
                />
          </div>
        );
      }
    
};

export default Frontpage;
