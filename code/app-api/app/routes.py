from fastapi import FastAPI
import logging

from . import graphql, init
from app.chat import router as chat_router

logger = logging.getLogger(__name__)

#### Routes ####

app = FastAPI()

@app.on_event("startup")
async def reinit():
    init.init()

app.include_router(graphql.get_app(), prefix="/api")
app.include_router(chat_router, prefix="")
