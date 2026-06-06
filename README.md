# Sahayak (सहायक) — AIIMS Jodhpur AI Patient Assistant

An intelligent chatbot designed to assist patients, attendants, and visitors at **All India Institute of Medical Sciences (AIIMS), Jodhpur**. Built with FastAPI and powered by Groq's LLM API.

---

## Features of this bot 

- 🏥 **Department & Doctor Queries** — Find the right doctor/department for your health concern
- 📅 **OPD Appointment Booking** — Walk-in timings, online booking via ORS portal, Swasthya app
- 🚨 **Emergency Contacts** — 24×7 emergency numbers and trauma center info
- 🩸 **Hospital Facilities** — Blood bank, ICU, pharmacy, labs, diagnostics
- 🗺️ **Campus Navigation** — Building locations, gates, disability access, lifts/ramps
- 📞 **Telemedicine Guidance** — Remote consultation helplines and eSanjeevani portal
- 🎤 **Voice Input** — Speech-to-text support (Hindi & English)
- 🔊 **Text-to-Speech** — Read aloud bot responses
- 🌐 **Bilingual** — Automatically responds in Hindi or English based on user input

---

## Tech Stack which is intigrated  

| Component | Technology |
|-----------|-----------|
| Backend | Python 3.10+ / FastAPI |
| AI Engine | Groq API (llama-3.3-70b-versatile) |
| Frontend | HTML5 / CSS3 / Vanilla JavaScript |
| Environment | python-dotenv |

---

## Prerequisites

- Python 3.10 or higher
- A **Groq API Key** (free) — get one at [https://console.groq.com](https://console.groq.com)
- A modern web browser (Chrome, Firefox, Edge)

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Hospital_bot
```

### 2. Create and activate a virtual environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**
```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

**macOS / Linux:**
```bash
cp .env.example .env
```

**Windows:**
```cmd
copy .env.example .env
```

Open `.env` and add your Groq API key:

```
GROQ_API_KEY=gsk_your_api_key_here
```

> **Get a Groq API key:**
> 1. Go to [https://console.groq.com](https://console.groq.com)
> 2. Sign up for a free account
> 3. Navigate to **API Keys** and create a new key
> 4. Copy the key and paste it into your `.env` file

### 5. (Optional) Populate the knowledge base

The file `master.md` already contains comprehensive AIIMS Jodhpur data. If you need to update it, edit `master.md` with the latest information. The chatbot reads this file at startup.

### 6. Run the server

```bash
python main.py
```

The server will start at **http://localhost:8080** and automatically open in your browser.

If the browser doesn't open automatically, navigate to [http://localhost:8080](http://localhost:8080) manually.

### 7. (Optional) Stop the server

Press `Ctrl+C` in the terminal where the server is running.

---

## Project Structure

```
Hospital_bot/
├── ai_engine.py          # Chatbot logic — system prompt, history, Groq API calls
├── main.py               # FastAPI server — routes, static files, CORS
├── master.md             # Knowledge base — AIIMS Jodhpur data
├── requirements.txt      # Python dependencies
├── .env.example          # Environment variable template
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── static/
│   ├── index.html        # Frontend HTML — chat UI
│   ├── style.css         # Frontend styles — glassmorphism design
│   └── script.js         # Frontend logic — chat, speech, TTS
└── master.txt            # (Legacy — not used)
```

---

## API Reference

### `GET /`

Serves the main chat interface (`static/index.html`).

### `POST /api/chat`

Send a message to the chatbot.

**Request:**
```json
{
  "message": "Who is the head of cardiology?"
}
```

**Response:**
```json
{
  "response": "The Head of Cardiology at AIIMS Jodhpur is **Dr. Surender Deora**..."
}
```

---

## Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key for LLM access |

### Chatbot settings (in `ai_engine.py`)

| Setting | Default | Description |
|---------|---------|-------------|
| `model` | `llama-3.3-70b-versatile` | Groq LLM model |
| `temperature` | `0.3` | Response creativity (0.0–1.0) |
| `max_history` | `30` | Max conversation turns kept in memory |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Groq API Key is not configured"** | Create a `.env` file with `GROQ_API_KEY=your_key` |
| **"master.md not found"** | Ensure `master.md` exists in the project root |
| **Port 8080 already in use** | Edit `main.py` and change `port=8080` to another number |
| **Speech recognition not working** | Use Chrome or Edge — Firefox has limited support |
| **Slow responses** | Check your internet connection; Groq API may be throttled |

---

## Development

### Adding new knowledge

Edit `master.md` to add or update AIIMS Jodhpur information. The chatbot will use this data at the next startup. No code changes needed.

### Modifying the system prompt

Edit the `self.system_prompt` string in `ai_engine.py`. Restart the server for changes to take effect.

### Testing

```bash
# Check Python syntax
python -c "import py_compile; py_compile.compile('ai_engine.py', doraise=True)"
python -c "import py_compile; py_compile.compile('main.py', doraise=True)"
```

---

## License

This project is intended for educational and informational purposes. Not affiliated with or endorsed by AIIMS Jodhpur.

---

## Disclaimer

Sahayak is an AI assistant designed to provide general hospital information. It is **not** a substitute for professional medical advice. Always consult a qualified doctor for medical concerns. In case of emergency, call **0291-2831622** or visit AIIMS Jodhpur Emergency (Gate 3) immediately.
