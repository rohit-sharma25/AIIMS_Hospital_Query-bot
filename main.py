from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from ai_engine import SahayakChatbot

app = FastAPI(title="Sahayak - AIIMS Jodhpur Chatbot")

# CORS middleware for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Chatbot
chatbot = SahayakChatbot()

# Mount static files
# Ensure the static directory exists, or this will fail. We will create it.
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.get("/", response_class=HTMLResponse)
async def get_index():
    try:
        with open("static/index.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return "<h1>Error: static/index.html not found. Please create the frontend files.</h1>"

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    user_msg = request.message
    # Get response from AI engine
    bot_reply = chatbot.get_response(user_msg)
    return ChatResponse(response=bot_reply)

if __name__ == "__main__":
    import uvicorn
    import webbrowser
    import threading
    import time

    def open_browser():
        time.sleep(1.5) # Wait for server to start
        print("\nOpening Sahayak in your browser at http://localhost:8080\n")
        webbrowser.open("http://localhost:8080")

    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run(app, host="0.0.0.0", port=8080)
