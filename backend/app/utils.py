import os
import requests
from dotenv import load_dotenv
import openai
import logging
import time



# Configure logging
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',  # Log message format
    handlers=[
        logging.StreamHandler()  # Log to the console
    ]
)

logger = logging.getLogger(__name__)

load_dotenv()

NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

openai.api_key = OPENAI_API_KEY

def fetch_news(page_size=50):
    """
    Fetches news articles for a predefined list of keywords.
    
    Returns:
        list: A list of unique articles aggregated from all keywords.
    """
    keywords = ["Election", "Trump", "Harris"]
    url = 'https://newsapi.org/v2/everything'
    all_articles = []

    for keyword in keywords:
        params = {
            'q': keyword,
            'apiKey': NEWSAPI_KEY,
            'language': 'en',
            'sortBy': 'publishedAt',
            'pageSize': page_size
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            articles = data.get('articles', [])
            all_articles.extend(articles)
        except requests.exceptions.RequestException as e:
            print(f"Error fetching articles for keyword '{keyword}': {e}")

    # Remove duplicate articles based on the title
    unique_articles = {article['title']: article for article in all_articles if 'title' in article}.values()
    return list(unique_articles)

def categorize_bias(content: str, url: str, retries: int = 3, backoff_factor: float = 1.0) -> str:
    """
    Categorize the bias of an article using OpenAI's ChatCompletion with retry logic.

    Args:
        content (str): The content of the article.
        url (str): The URL of the article.
        retries (int): Number of retry attempts.
        backoff_factor (float): Factor by which the delay increases after each retry.

    Returns:
        str: The bias category ('left', 'neutral', 'right').
    """
    prompt = f"""
    Analyze the following article content and determine its political bias. 
    Categorize the bias as 'left', 'neutral', or 'right'.

    Article Content:
    {content}

    Article URL:
    {url}

    Bias Category:
    """

    for attempt in range(1, retries + 1):
        try:
            logger.info(f"Attempting to categorize bias for URL: {url} (Attempt {attempt})")
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that categorizes the political bias of news articles.You only respond with one word."},
                    {"role": "user", "content": prompt}
                ],

            )
            print(response.choices[0].message.content)
            bias = (response.choices[0].message.content).strip().lower()
            if bias in ['left', 'neutral', 'right']:
                logger.info(f"Categorized bias as: {bias}")
                return bias
            else:
                logger.warning(f"Unexpected bias category received: {bias}. Defaulting to 'neutral'.")
                return 'neutral'
        except openai.error.RateLimitError as e:
            logger.error(f"Rate limit exceeded: {e}. Attempt {attempt} of {retries}.")
            if attempt < retries:
                sleep_time = backoff_factor * (2 ** (attempt - 1))
                logger.info(f"Sleeping for {sleep_time} seconds before retrying...")
                time.sleep(sleep_time)
            else:
                logger.error("Max retries reached. Defaulting bias to 'neutral'.")
                return 'neutral'
        except openai.error.OpenAIError as e:
            logger.error(f"OpenAI API error: {e}. Attempt {attempt} of {retries}.")
            if attempt < retries:
                sleep_time = backoff_factor * (2 ** (attempt - 1))
                logger.info(f"Sleeping for {sleep_time} seconds before retrying...")
                time.sleep(sleep_time)
            else:
                logger.error("Max retries reached. Defaulting bias to 'neutral'.")
                return 'neutral'
        except Exception as e:
            logger.error(f"Unexpected error: {e}. Defaulting bias to 'neutral'.")
            return 'neutral'