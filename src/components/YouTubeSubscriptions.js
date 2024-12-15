import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { YOUTUBE_API_KEY, AUTH_CLIENT_ID } from "../config";

const YouTubeSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const CLIENT_ID = AUTH_CLIENT_ID;
  const API_KEY = YOUTUBE_API_KEY;
  const SCOPES = "https://www.googleapis.com/auth/youtube.readonly";

  useEffect(() => {
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

            // Set initial authentication state
            setIsAuthenticated(authInstance.isSignedIn.get());

            // Listen for sign-in state changes
            authInstance.isSignedIn.listen((isSignedIn) => {
              setIsAuthenticated(isSignedIn);
              if (isSignedIn) {
                fetchAllSubscriptions(); // Fetch subscriptions upon successful authentication
              }
            });

            // Fetch subscriptions if already authenticated
            if (authInstance.isSignedIn.get()) {
              fetchAllSubscriptions();
            }
          })
          .catch((error) => console.error("Error initializing GAPI client", error));
      });
    };

    initClient();
  }, []);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setSubscriptions([]); // Clear subscriptions on sign-out
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

      setSubscriptions(sortedSubscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions", error);
    }
  };

  return (
    <div>
      <h1>YouTube Subscriptions</h1>
      {isAuthenticated ? (
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
          <ul>
            {subscriptions.map((sub) => (
              <li key={sub.id}>
                <img
                  src={sub.snippet.thumbnails.default.url}
                  alt={sub.snippet.title}
                  style={{ width: "50px", marginRight: "10px" }}
                />
                {sub.snippet.title}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button onClick={handleSignIn}>Show Subscriptions Page</button>
      )}
    </div>
  );
};

export default YouTubeSubscriptions;
