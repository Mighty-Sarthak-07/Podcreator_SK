import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PodcastCard from "../components/PodcastCard/PodcastCard";

const AllPodcast = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/get-podcasts`);
        setPodcasts(res.data.data);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        setError("Failed to fetch podcasts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  if (isLoading) {
    return <div>Loading podcasts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="w-full px-4 lg:px-12 grid py-4 grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {podcasts && podcasts.map((items, i) => (
          <div key={i}>
            <PodcastCard items={items} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllPodcast