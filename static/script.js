document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const typingIndicator = document.getElementById('typing-indicator');
    
    // Modal Logic
    const infoBtn = document.getElementById('info-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const infoModal = document.getElementById('info-modal');

    infoBtn.addEventListener('click', () => {
        infoModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        infoModal.classList.add('hidden');
    });

    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.classList.add('hidden');
        }
    });

    // Speech Recognition Logic
    const micBtn = document.getElementById('mic-btn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition && micBtn) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        // 'hi-IN' locale handles both English and Hindi accents very well
        recognition.lang = 'hi-IN'; 
        recognition.interimResults = false;
        
        let isRecording = false;

        micBtn.addEventListener('click', () => {
            if (isRecording) {
                recognition.stop();
            } else {
                try {
                    recognition.start();
                } catch(e) {
                    console.error("Speech recognition already started");
                }
            }
        });

        recognition.onstart = () => {
            isRecording = true;
            micBtn.classList.add('recording');
            userInput.placeholder = "Listening... Speak now";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            // Focus input so user can edit or send
            userInput.focus(); 
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            micBtn.classList.remove('recording');
            userInput.placeholder = "Ask about doctors, timings, facilities...";
        };

        recognition.onend = () => {
            isRecording = false;
            micBtn.classList.remove('recording');
            userInput.placeholder = "Ask about doctors, timings, facilities...";
        };
    } else if (micBtn) {
        micBtn.style.display = 'none';
        console.warn('Speech Recognition API not supported in this browser.');
    }

    window.sendSuggestion = function(text) {
        // Strip the emoji from the suggestion string
        const cleanText = text.replace(/^[^\w\s]+/, '').trim();
        userInput.value = cleanText;
        
        // Hide chips after first use
        const chipsContainer = document.querySelector('.suggestion-chips');
        if (chipsContainer) {
            chipsContainer.style.display = 'none';
        }
        
        // Trigger submit
        document.getElementById('send-btn').click();
    };

    function setLoadingState(loading) {
        const sendBtn = document.getElementById('send-btn');
        const sendIcon = sendBtn.querySelector('i');
        
        if (loading) {
            userInput.disabled = true;
            sendBtn.disabled = true;
            sendBtn.classList.add('loading');
            sendIcon.className = 'fa-solid fa-spinner';
        } else {
            userInput.disabled = false;
            sendBtn.disabled = false;
            sendBtn.classList.remove('loading');
            sendIcon.className = 'fa-solid fa-paper-plane';
            userInput.focus();
        }
    }

    // Chat Logic
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;
        
        // Prevent duplicate submissions while loading
        const sendBtn = document.getElementById('send-btn');
        if (sendBtn.classList.contains('loading')) return;

        // 1. Disable input and show loading state
        setLoadingState(true);
        
        // 2. Add user message to chat
        appendMessage(message, 'user');
        userInput.value = '';
        
        // 3. Show typing indicator
        showTypingIndicator();

        // 4. Send to API
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            
            // 5. Hide typing indicator and show bot response
            hideTypingIndicator();
            appendMessage(data.response, 'bot');
            
        } catch (error) {
            console.error('Error:', error);
            hideTypingIndicator();
            appendMessage("I'm sorry, I am having trouble connecting to the server right now. Please try again later.", 'bot');
        } finally {
            // 6. Re-enable input
            setLoadingState(false);
        }
    });

    let currentUtterance = null;
    let currentTtsBtn = null;

    window.toggleSpeech = function(text, btnElement) {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            if (currentTtsBtn) {
                currentTtsBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            if (currentTtsBtn === btnElement) {
                currentTtsBtn = null;
                return; // Stopped the current audio
            }
        }
        
        // Strip markdown asterisks for better pronunciation
        const cleanText = text.replace(/\*/g, '');
        
        currentUtterance = new SpeechSynthesisUtterance(cleanText);
        
        // Auto-detect Hindi characters or common roman Hindi words to set the accent
        if (/[\u0900-\u097F]/.test(cleanText) || cleanText.toLowerCase().includes('namaste') || cleanText.toLowerCase().includes('karein')) {
            currentUtterance.lang = 'hi-IN';
        } else {
            currentUtterance.lang = 'en-US';
        }

        currentUtterance.onend = () => {
            btnElement.innerHTML = '<i class="fas fa-volume-up"></i>';
            currentTtsBtn = null;
        };

        btnElement.innerHTML = '<i class="fas fa-stop"></i>';
        currentTtsBtn = btnElement;
        
        window.speechSynthesis.speak(currentUtterance);
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message slide-in`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        const now = new Date();
        timeSpan.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        if (sender === 'bot') {
            contentDiv.innerHTML = parseMarkdown(text);
            
            const ttsBtn = document.createElement('button');
            ttsBtn.className = 'tts-btn';
            ttsBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            ttsBtn.title = "Read aloud";
            ttsBtn.onclick = () => toggleSpeech(text, ttsBtn);
            
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'msg-controls';
            controlsDiv.appendChild(timeSpan);
            controlsDiv.appendChild(ttsBtn);
            
            msgDiv.appendChild(contentDiv);
            msgDiv.appendChild(controlsDiv);
        } else {
            contentDiv.textContent = text;
            msgDiv.appendChild(contentDiv);
            msgDiv.appendChild(timeSpan);
        }
        
        chatBox.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        typingIndicator.classList.remove('hidden');
        chatBox.appendChild(typingIndicator); // Move to bottom
        scrollToBottom();
    }

    function hideTypingIndicator() {
        typingIndicator.classList.add('hidden');
    }

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function parseMarkdown(text) {
        // Replace **bold** with <strong>bold</strong>
        let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace *italic* with <em>italic</em>
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Replace newlines with <br>
        html = html.replace(/\n/g, '<br>');
        return html;
    }
});
