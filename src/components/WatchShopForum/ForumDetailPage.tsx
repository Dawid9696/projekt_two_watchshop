import React from 'react';
import {Link} from 'react-router-dom'

const ForumDetailPage:React.FC = () => {
  return (
    <div className="ForumDetailPage">
        <div className="ForumDetailPage-content">

          <div className="ForumDetailPage-thema"><h3 style={{margin:"5px"}}>Jak dodac nowy hooke w react?</h3></div>

          <div className="ForumDetailPage-person">
            <div className="ForumDetailPage-person-personal">
              <div className="ForumDetailPage-person-personal-data">
                <Link to={`/user`} className="ForumLogo-div">
                  <img className="ForumLogo" src="https://static01.leroymerlin.pl/files/media/image/610/2174610/product/main.jpg"/>
                </Link>
              </div>
              <div>
                <div><h5>Dawid96</h5></div>
                <div><p>Mroczkowski</p></div>
                <div><p>Zabrze</p></div>
                <div><p>Email</p></div>
                <div><p>Mroczkowski</p></div>
                <div><p>Mroczkowski</p></div>
              </div>
            </div>
              <div className="ForumDetailPage-person-content">
                <div className="ForumDetailPage-person-text">TRESC</div>
                <div className="ForumDetailPage-person-content-tags">
                  <div>Date</div>
                  <div>RATIO</div>
                </div>
              </div>
          </div>
        </div>
    </div>
  );
}

export default ForumDetailPage;
