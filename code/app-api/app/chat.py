from typing import Iterator
from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import cohere
from cohere import StreamedChatResponse
from dotenv import load_dotenv

# Load the environment variables
load_dotenv(override=True)


# Define the ChatRequest model
class ChatRequest(BaseModel):
    query: str
    url: str

# Initialize the router
router = APIRouter()

# Initialize Cohere client
co = cohere.Client()

def token_iterator(response: Iterator[StreamedChatResponse]) -> Iterator[str]:
    for chunk in response:
        if chunk.event_type == 'text-generation':
            yield chunk.text
        elif chunk.event_type == "stream-end":
            break

# Define the /api/chat endpoint
@router.post("/api/chat")
async def chat(chat_request: ChatRequest):
    # Execute the search using Cohere
    try:
        response = co.chat(
            message=chat_request.query,
            connectors=[{"id": "web-search", "options": {"site": chat_request.url}}],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Return the text of the response
    return {"message": response.text}

# Define the /api/chat endpoint
@router.post("/api/chat_stream")
async def chat_stream(chat_request: ChatRequest) -> StreamingResponse:
    # Execute the search using Cohere
    try:
        response = co.chat_stream(
            message=chat_request.query,
            connectors=[{"id": "web-search", "options": {"site": chat_request.url}}],
            chat_stream=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return StreamingResponse(token_iterator(response), media_type="text/plain")
