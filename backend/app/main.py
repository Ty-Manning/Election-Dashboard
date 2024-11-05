from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from . import models, schemas, crud, utils
from .database import SessionLocal, engine
import uvicorn

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all CORS origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/fetch-articles/")
def fetch_articles(db: Session = Depends(get_db)):
    articles = utils.fetch_news()  # Invoke the function
    added_articles = []
    for article in articles:
        existing = crud.get_article_by_title(db, title=article['title'])
        if existing and existing.removed:
            continue
        if not existing:
            db_article = crud.create_article(db, schemas.ArticleCreate(
                title=article['title'],
                url=article['url'],
                content=article.get('content'),
                published_date=article['publishedAt']
            ))
            bias = utils.categorize_bias(db_article.content, db_article.url)
            crud.update_article_bias(db, db_article, bias)
            added_articles.append(db_article)
    return {"added": len(added_articles)}

@app.get("/articles/", response_model=List[schemas.Article])
def get_articles(bias: Optional[str] = None, db: Session = Depends(get_db)):
    if bias:
        return crud.get_articles_by_bias(db, bias)
    else:
        # Fetch all biases
        left = crud.get_articles_by_bias(db, 'left')
        neutral = crud.get_articles_by_bias(db, 'neutral')
        right = crud.get_articles_by_bias(db, 'right')
        return left + neutral + right

@app.delete("/articles/{article_id}/")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    crud.remove_article(db, article)
    return {"message": "Article removed"}

@app.get("/states/", response_model=List[schemas.State])
def read_states(db: Session = Depends(get_db)):
    states = crud.get_states(db)
    return states


@app.put("/states/{state_id}/", response_model=schemas.State)
def update_state(state_id: int, state_update: schemas.StateUpdate, db: Session = Depends(get_db)):
    if state_update.expected_vote not in ['Harris', 'Trump', 'Neutral']:
        raise HTTPException(status_code=400, detail="Invalid vote category")
    state = crud.update_state_vote(db, state_id, state_update.expected_vote)
    if not state:
        raise HTTPException(status_code=404, detail="State not found")
    return state

@app.get("/swing-states/", response_model=List[schemas.State])
def get_swing_states(db: Session = Depends(get_db)):
    # Define swing states as those with 'Neutral' expected_vote
    swing_states = db.query(models.State).filter(models.State.expected_vote == 'Neutral').all()
    return swing_states

@app.get("/electoral-count/")
def get_electoral_count(db: Session = Depends(get_db)):
    states = db.query(models.State).all()
    count_harris = 0
    count_trump = 0
    for state in states:
        if state.expected_vote == 'Harris':
            count_harris += state.electoral_votes
        elif state.expected_vote == 'Trump':
            count_trump += state.electoral_votes
    return {
        "Harris": count_harris,
        "Trump": count_trump
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
