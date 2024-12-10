import { useState,useEffect } from 'react'; 
import axios from "axios";
import NewsItems from './NewsItems';
import '../News.css';
// import InfiniteScroll from "react-infinite-scroll-component";
function News() {
  let hi =
    "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&key=AIzaSyDBHLiRQUQt4o0WJeYRfz8DAkJGsP9VgP8";
  const [val, setVal] = useState([]);
  useEffect(() => {
    axios
      .get(hi)
      .then((res) => {
        console.log(res.data.items);
        setVal(res.data.items);
      })
    // eslint-disable-next-line
  }, []);
  return (
    <div className="news">
      
      <h1 style={{ marginLeft: "40%", marginTop: "3%" }}>Popular Videos</h1>
      <div className="news-items">
        {val.map((x) => (
          <NewsItems
            key={x.id}
            source={x.snippet.channelTitle}
            link={`https://www.youtube.com/watch?v=${x.id}`}
            title={x.snippet.title}
            description={x.snippet.description.length > 50
              ? `${x.snippet.description.slice(0, 100)}...`
              : x.snippet.description}
            img={x.snippet.thumbnails.high.url}
          />
        ))}
      </div>
    </div>
  );
}

export default News