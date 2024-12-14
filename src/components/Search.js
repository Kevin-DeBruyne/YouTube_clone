import React, { useState, useEffect, useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import NewsItems from "./NewsItems"; // Ensure this component is imported correctly.
import { YOUTUBE_API_KEY } from '../config';
import '../Search.css';

function Search() {
    const [searchQuery, setSearchQuery] = useState(""); // For the search input
    const [val, setVal] = useState([]); // For storing video data
    const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced search query

    // Debouncing logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500); // Adjust the delay as needed (e.g., 500ms)

        return () => {
            clearTimeout(handler); // Clear timeout if searchQuery changes
        };
    }, [searchQuery]);

    // Function to fetch videos based on the search query
    const fetchVideos = useCallback((query) => {
        const apiUrl = query
            ? `https://www.googleapis.com/youtube/v3/search?part=snippet,id&q=${query}&type=video&maxResults=50&key=${YOUTUBE_API_KEY}`
            : `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=IN&maxResults=50&key=${YOUTUBE_API_KEY}`;

        axios
            .get(apiUrl)
            .then((res) => {
                setVal(res.data.items || []);
            })
            .catch((error) => {
                console.error("Error fetching videos:", error);
            });
    }, []);

    // Fetch videos when the debouncedQuery changes
    useEffect(() => {
        fetchVideos(debouncedQuery);
    }, [debouncedQuery, fetchVideos]);

    // Handle input change
    const changeHandler = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <>
            <Form className="d-flex search-bar">
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={changeHandler}
                />
                <Button variant="outline-success">Search</Button>
            </Form>

            <div className="news">
                <h1 style={{ marginLeft: "40%", marginTop: "3%" }}>
                    {searchQuery ? "Search Results" : "Popular Videos"}
                </h1>
                <div className="search-items">
                    {val.map((x) => (
                        <NewsItems
                            key={x.id.videoId || x.id}
                            source={x.snippet.channelTitle}
                            link={`https://www.youtube.com/watch?v=${x.id.videoId || x.id}`}
                            title={x.snippet.title}
                            description={
                                x.snippet.description.length > 50
                                    ? `${x.snippet.description.slice(0, 100)}...`
                                    : x.snippet.description
                            }
                            img={x.snippet.thumbnails.high.url}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Search;
