import os
from dotenv import load_dotenv
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from pydantic import BaseModel

# -----------------------------------------------------------------------------
# DB 설정
# -----------------------------------------------------------------------------
load_dotenv(".env.local")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./todos.db"
)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# -----------------------------------------------------------------------------
# DB 모델
# -----------------------------------------------------------------------------

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)

# -----------------------------------------------------------------------------
# Pydantic 스키마
# -----------------------------------------------------------------------------

class TodoCreate(BaseModel):
    title: str
    completed: bool = False


class TodoUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None


class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool

    class Config:
        from_attributes = True

# -----------------------------------------------------------------------------
# 테이블 생성
# -----------------------------------------------------------------------------

Base.metadata.create_all(bind=engine)

# -----------------------------------------------------------------------------
# FastAPI 앱 생성
# -----------------------------------------------------------------------------

app = FastAPI(title="Todo API")

# -----------------------------------------------------------------------------
# CORS 설정
# -----------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# DB 세션 의존성
# -----------------------------------------------------------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------------------------------------------------------
# API 구현
# -----------------------------------------------------------------------------

@app.get("/todos", response_model=List[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(Todo).all()


@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(
        title=todo.title,
        completed=todo.completed
    )

    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)

    return db_todo


@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo: TodoUpdate,
    db: Session = Depends(get_db)
):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if not db_todo:
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    if todo.title is not None:
        db_todo.title = todo.title

    if todo.completed is not None:
        db_todo.completed = todo.completed

    db.commit()
    db.refresh(db_todo)

    return db_todo


@app.delete("/todos/{todo_id}")
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()

    if not db_todo:
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    db.delete(db_todo)
    db.commit()

    return {
        "message": "Todo deleted successfully",
        "id": todo_id
    }