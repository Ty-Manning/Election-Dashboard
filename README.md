
# Election News Bias Categorizer

**_⚠️ CURRENTLY EXPERIENCING AN ERROR IN ARTICLE SORTING UPON REFRESH._**

Election News Bias Categorizer is a full-stack application designed to fetch news articles, categorize their political bias using OpenAI’s GPT-4, and display them in an organized and user-friendly interface. Users can filter articles based on bias categories (Left, Neutral, Right) and manage article visibility. The application includes a second page to select a political category for swing states and predict the 2024 election.

## 🛠️ Features

- **Automated News Fetching**: Retrieves the latest news articles from a configured news API.
- **Bias Categorization**: Uses OpenAI’s GPT-4 to analyze and categorize political bias.
- **Interactive Frontend**: Displays categorized articles with options to remove unwanted entries.
- **Persistent Removals**: Stores removals locally to prevent reappearance upon refresh.
- **Backend Management**: RESTful APIs manage articles and state data.
- **Dockerized Environment**: Simplifies setup and deployment with Docker and Docker Compose.

## 🧰 Technologies Used

- **Frontend**: React.js, Axios
- **Backend**: FastAPI, SQLAlchemy, Uvicorn
- **Database**: MySQL
- **API Integration**: OpenAI GPT-4, NewsAPI.org
- **Containerization**: Docker, Docker Compose
- **Others**: Python, Node.js, npm

## 🚀 Prerequisites

Before getting started, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) (20.10.0+)
- [Docker Compose](https://docs.docker.com/compose/install/) (1.29.0+)
- [Node.js](https://nodejs.org/en/download/) (14.x+)
- [npm](https://www.npmjs.com/get-npm) (6.x+)

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ty-Manning/election-dashboard.git
cd election-dashboard
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory with the following configuration:

**Backend Environment Variables**

```plaintext
OPENAI_API_KEY=your-openai-api-key
NEWS_API_KEY=your-news-api-key
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-db-password
DB_NAME=election_db
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 3. Start Docker Containers

Ensure Docker is running on your machine, then start the container:

```bash
docker-compose up -d
```

This command will:
- Set up the MySQL database.

### 4. Install Frontend Dependencies

Navigate to the frontend directory and install necessary dependencies:

```bash
cd frontend
npm install
```

## 🏁 Running the Application

### 1. Start the Backend Server

To run it manually:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend Server

In a new terminal, start the React development server:

```bash
cd frontend
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## 📝 Environment Variables Explained

Detailed explanation of each variable in `.env`:

- `OPENAI_API_KEY`: Your OpenAI API key for article bias categorization.
- `NEWS_API_KEY`: API key from NewsAPI.org for fetching news.
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: MySQL database configuration.
- `REACT_APP_BACKEND_URL`: URL where the backend FastAPI server is running.

> **Note**: Keep sensitive information in `.env` secure and avoid committing it to version control.

## 🔍 Changing the Search Keywords

Update the `search_keywords` variable in `backend/app/utils.py` to customize news topics:

```python
search_keywords = "climate change, economy, healthcare"
```

Restart the backend server to apply changes, and use the “Refresh” button in the frontend to fetch articles based on updated keywords.

## 🐳 Docker Setup Details

### Docker Compose Overview

The project uses Docker Compose for the MySQL database services.

**Starting Docker Containers**:

```bash
docker-compose up -d
```

**Stopping Docker Containers**:

- Stop without removal:

  ```bash
  docker-compose stop
  ```

- Stop and remove all:

  ```bash
  docker-compose down
  ```

**Viewing Logs**:

- For all services:

  ```bash
  docker-compose logs -f
  ```
## 📚 Project Structure

```plaintext
election-news-bias-categorizer/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   ├── utils.py
│   │   ├── database.py
│   ├── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MainPage.jsx
│   │   │   ├── ArticleColumn.jsx
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json
│   ├── package-lock.json
├── docker-compose.yml
├── .env
├── README.md
└── ...
```

## 🧪 Testing the Application

1. **Fetch and Categorize Articles**: Click “Refresh” in the frontend to verify categorization.
2. **Remove an Article**: Test article removal and ensure it’s persistent upon refresh.
3. **Change Keywords**: Update `search_keywords`, restart the backend, and refresh to see new articles.

## 🛠️ Troubleshooting

1. **OpenAI API Not Being Called**: Verify the `OPENAI_API_KEY` in `.env` and check backend logs for API calls.
2. **Articles Categorized as ‘Neutral’**: Check prompt clarity in `categorize_bias` and inspect the OpenAI response.
3. **Docker Issues**: Use `docker-compose logs` to view error details.
4. **Frontend-Backend Communication Issues**: Verify CORS settings and `REACT_APP_BACKEND_URL`.

## 🔗 Useful Links

- [OpenAI API Documentation](https://beta.openai.com/docs/)
- [NewsAPI.org Documentation](https://newsapi.org/docs/get-started)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/)
- [Docker Documentation](https://docs.docker.com/)
