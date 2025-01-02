import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { YOUTUBE_API_KEY, AUTH_CLIENT_ID } from "../config";
import SearchItems from "./SearchItems";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from "react-bootstrap";
const lunr = require("lunr");

const YouTubeSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // For the search input
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [index, setIndex] = useState(null);

  const CLIENT_ID = AUTH_CLIENT_ID;
  const API_KEY = YOUTUBE_API_KEY;
  const SCOPES = "https://www.googleapis.com/auth/youtube.readonly";

  useEffect(() => {
    console.log("Initializing GAPI client...");
    const initClient = () => {
      gapi.load("client:auth2", () => {
        gapi.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES,
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
            ],
          })
          .then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            console.log("GAPI client initialized successfully!");

            setIsAuthenticated(authInstance.isSignedIn.get());
            authInstance.isSignedIn.listen((isSignedIn) => {
              setIsAuthenticated(isSignedIn);
              if (isSignedIn) {
                fetchAllSubscriptions();
              }
            });

            if (authInstance.isSignedIn.get()) {
              fetchAllSubscriptions();
            }
          })
          .catch((error) =>
            console.error("Error initializing GAPI client", error)
          );
      });
    };

    initClient();
  }, []);

  useEffect(() => {
    if (subscriptions.length > 0) {
      console.log("Building Lunr index with subscriptions:", subscriptions);
      const lunrIndex = lunr(function () {
        this.ref("id");
        this.field("title");
        this.field("description");

        subscriptions.forEach((sub, idx) => {
          this.add({ ...sub.snippet, id: idx });
        });
      });
      setIndex(lunrIndex);
      console.log("Lunr index built successfully!");
    }
  }, [subscriptions]);

  useEffect(() => {
    if (searchQuery && index) {
      console.log("Performing search for query:", searchQuery);
      const results = index
        .search(searchQuery)
        .map((result) => subscriptions[result.ref]);
      console.log("Search results:", results);
      setFilteredResults(results);
    } else if (!searchQuery) {
      console.log("Search query is empty, showing all subscriptions.");
      setFilteredResults(subscriptions);
    }
  }, [searchQuery, index]);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const changeHandler = (event) => {
    console.log("Search query updated:", event.target.value);
    setSearchQuery(event.target.value);
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setSubscriptions([]);
  };

  const fetchAllSubscriptions = async () => {
    try {
      let allSubscriptions = [];
      let nextPageToken = null;

      do {
        const response = await gapi.client.youtube.subscriptions.list({
          part: "snippet,contentDetails",
          mine: true,
          maxResults: 50,
          pageToken: nextPageToken,
        });

        allSubscriptions = [...allSubscriptions, ...response.result.items];
        nextPageToken = response.result.nextPageToken;
      } while (nextPageToken);

      const sortedSubscriptions = allSubscriptions.sort((a, b) =>
        a.snippet.title.localeCompare(b.snippet.title)
      );

      console.log("Fetched and sorted subscriptions:", sortedSubscriptions);
      setSubscriptions(sortedSubscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions", error);
    }
  };

  return (
    <div>
      <h1>YouTube Subscriptions</h1>
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
      {isAuthenticated ? (
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
          <div className="search-items">
            {(filteredResults.length > 0 ? filteredResults : subscriptions).map(
              (sub) => (
                <SearchItems
                  key={sub.id}
                  source={sub.snippet.title}
                  img={sub.snippet.thumbnails.high.url}
                  title={sub.snippet.title}
                  readmore="View Channel"
                  description={
                    sub.snippet.description.length > 50
                      ? `${sub.snippet.description.slice(0, 100)}...`
                      : sub.snippet.description
                  }
                  link={`https://www.youtube.com/channel/${sub.snippet.resourceId.channelId}`}
                />
              )
            )}
          </div>
        </div>
      ) : (
        <button onClick={handleSignIn}>Show Subscriptions Page</button>
      )}
    </div>
  );
};

export default YouTubeSubscriptions;
