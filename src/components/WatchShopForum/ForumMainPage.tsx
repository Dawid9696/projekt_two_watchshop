import React from 'react';
import {Link} from 'react-router-dom'

const ForumMainPage:React.FC = () => {
  return (
    <div className="ForumMainPage">
        <div className="ForumMainPage-content">
          <div className="ForumMainPage-content-header">
            <h5 style={{margin:"0px",color:"black"}}>RESULTS</h5>
            <div  className="ForumMainPage-content-header-search">
              <div><input type="text" placeholder="Szukaj..." /></div>
              <div><button>Szukaj</button></div>
            </div>
            <div  className="ForumMainPage-content-header-filtertab">
              <div><h4 style={{margin:"0px",color:"grey"}}>Results: 3140</h4></div>
              <div className="ForumMainPage-content-header-filtertab-filters">
                <div>Newest</div>
                <div>Votes</div>
              </div>
            </div>
          </div>
          <div className="ForumMainPage-content-posts">
            <ForumMainPageCards/>
          </div>
        </div>
    </div>
  );
}

export default ForumMainPage;

const ForumMainPageCards:React.FC = () => {
  return (
    <Link to={`/post`} className="ForumMainPage-content-post">
        <div className="ForumMainPage-content-postdata">
          <div><h4 style={{margin:"0px",color:"grey"}}>523</h4></div>
          <div><p style={{margin:"0px",color:"grey"}}>votes</p></div>
          <div className="ForumMainPage-content-postdata-answers">39 answers</div>
        </div>

        <div className="ForumMainPage-content-posttitle">
          <div className="ForumMainPage-content-postthema">Q: Problem with react..</div>
          <div className="ForumMainPage-content-postdesc"><p style={{margin:"0px",color:"black",padding:"0px"}}>asdadfsdfasdadfsdgdfgdfgsdfsdfk skjdfhskjdhfskj skjhk sdfksjh ksjdhfskh kjsdhfksjhdgksjh sdkjhk shh ksdf kjh</p></div>
          <div className="ForumMainPage-content-postfooter">
            <div className="ForumMainPage-content-posttags">
              <div className="ForumMainPage-content-posttag">react</div>
              <div className="ForumMainPage-content-posttag">js</div>
            </div>
            <div className="ForumMainPage-content-postdate">Data</div>
          </div>
        </div>
    </Link>
  );
}