import React from 'react';
import './ArticleColumn.css';

function ArticleColumn({ title, articles, bias, removeArticle }) {
  const getBackgroundColor = () => {
    switch (bias) {
      case 'left':
        return '#ADD8E6'; // Blue
      case 'neutral':
        return '#D8BFD8'; // Purple
      case 'right':
        return '#F08080'; // Red
      default:
        return '#FFFFFF';
    }
  };

  return (
    <div className="article-column" style={{ backgroundColor: getBackgroundColor() }}>
      <h2>{title}</h2>
      <div className="articles">
        {articles.map(article => (
          <div key={article.id} className="article">
            <button className="remove-btn" onClick={() => removeArticle(article.title, article.id, bias)}>x</button>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
            <span className="date">{new Date(article.published_date).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleColumn;
