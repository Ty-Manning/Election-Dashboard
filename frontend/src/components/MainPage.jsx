// src/components/MainPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleColumn from './ArticleColumn';
import './MainPage.css';

function MainPage() {
  const [leftArticles, setLeftArticles] = useState([]);
  const [neutralArticles, setNeutralArticles] = useState([]);
  const [rightArticles, setRightArticles] = useState([]);
  const [removedTitles, setRemovedTitles] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingNewArticles, setFetchingNewArticles] = useState(false);

  // Load removedTitles from localStorage on component mount
  useEffect(() => {
    const removed = JSON.parse(localStorage.getItem('removedTitles')) || [];
    setRemovedTitles(removed);
  }, []);

  // Fetch articles when component mounts
  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch articles from the backend
  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching existing articles from backend...");
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/articles/`);
      console.log("Articles fetched:", response.data);
      
      // Filter out removed articles
      const articles = response.data.filter(article => !removedTitles.includes(article.title));
      console.log("Articles after filtering removed titles:", articles);
      
      // Categorize articles by bias
      const left = articles.filter(a => a.bias === 'left').slice(0, 10);
      const neutral = articles.filter(a => a.bias === 'neutral').slice(0, 10);
      const right = articles.filter(a => a.bias === 'right').slice(0, 10);

      console.log("Left Articles:", left);
      console.log("Neutral Articles:", neutral);
      console.log("Right Articles:", right);

      // Update state
      setLeftArticles(left);
      setNeutralArticles(neutral);
      setRightArticles(right);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to fetch articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch and add new articles, then refresh the articles list
  const refreshArticles = async () => {
    setFetchingNewArticles(true);
    setError(null);
    try {
      console.log("Fetching new articles from external sources...");
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/fetch-articles/`);
      console.log("New articles fetched and added:", response.data.added);
      
      // After fetching new articles, retrieve the updated articles list
      await fetchArticles();
      
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error refreshing articles:", error);
      setError("Failed to refresh articles. Please try again.");
    } finally {
      setFetchingNewArticles(false);
    }
  };

  // Function to remove an article
  const removeArticle = (title, id, bias) => {
    const updatedRemoved = [...removedTitles, title];
    setRemovedTitles(updatedRemoved);
    localStorage.setItem('removedTitles', JSON.stringify(updatedRemoved));

    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/articles/${id}/`)
      .then(() => {
        if (bias === 'left') {
          setLeftArticles(leftArticles.filter(article => article.id !== id));
        } else if (bias === 'neutral') {
          setNeutralArticles(neutralArticles.filter(article => article.id !== id));
        } else {
          setRightArticles(rightArticles.filter(article => article.id !== id));
        }
        console.log(`Article with id ${id} removed successfully.`);
      })
      .catch(error => {
        console.error("Error removing article:", error);
        setError("Failed to remove article. Please try again.");
      });
  };

  // Function to filter articles based on keyword
  const filtered = (articles) => {
    if (!filter) return articles;
    return articles.filter(article => article.title.toLowerCase().includes(filter.toLowerCase()));
  };

  return (
    <div className="main-page">
      {/* Display error messages if any */}
      {error && <div className="error-message">{error}</div>}

      {/* Controls Section */}
      <div className="controls">
        <input
          type="text"
          placeholder="Filter by keyword..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button onClick={refreshArticles} disabled={fetchingNewArticles}>
          {fetchingNewArticles ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Columns Section */}
      <div className="columns">
        <ArticleColumn
          title="Left Bias"
          articles={filtered(leftArticles)}
          bias="left"
          removeArticle={removeArticle}
        />
        <ArticleColumn
          title="Neutral"
          articles={filtered(neutralArticles)}
          bias="neutral"
          removeArticle={removeArticle}
        />
        <ArticleColumn
          title="Right Bias"
          articles={filtered(rightArticles)}
          bias="right"
          removeArticle={removeArticle}
        />
      </div>
    </div>
  );
}

export default MainPage;
