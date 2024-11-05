from sqlalchemy.orm import Session
from . import models, schemas

def get_article_by_title(db: Session, title: str):
    return db.query(models.Article).filter(models.Article.title == title).first()

def create_article(db: Session, article: schemas.ArticleCreate):
    db_article = models.Article(
        title=article.title,
        url=article.url,
        content=article.content,
        published_date=article.published_date
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def update_article_bias(db: Session, article: models.Article, bias: str):
    article.bias = bias
    db.commit()
    db.refresh(article)
    return article

def remove_article(db: Session, article: models.Article):
    article.removed = True
    db.commit()
    db.refresh(article)
    return article

def get_articles_by_bias(db: Session, bias: str, limit: int = 15):
    return db.query(models.Article).filter(models.Article.bias == bias, models.Article.removed == False).order_by(models.Article.published_date.desc()).limit(limit).all()

def get_states(db: Session):
    return db.query(models.State).all()

def update_state_vote(db: Session, state_id: int, expected_vote: str):
    state = db.query(models.State).filter(models.State.id == state_id).first()
    if state:
        state.expected_vote = expected_vote
        db.commit()
        db.refresh(state)
    return state
