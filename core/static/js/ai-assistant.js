(function () {
    'use strict';

    const AIAssistant = (function () {
        // UI References
        const ui = {
            overlay: document.getElementById('ai-panel-overlay'),
            messages: document.getElementById('ai-messages'),
            input: document.getElementById('ai-input'),
            form: document.getElementById('ai-input-form'),
            chips: document.getElementById('ai-suggested-chips'),
            closeBtn: document.getElementById('ai-close-btn'),
            sparkleBtn: document.getElementById('ai-search-sparkle-btn')
        };

        async function sendMessage(text) {
            const message = text || ui.input.value.trim();
            if (!message) return;

            // 1. Update UI (User bubble)
            appendBubble('user', message);
            ui.input.value = '';
            ui.chips.innerHTML = '';
            showTyping(true);

            try {
                // 2. Fetch from your Django backend
                const response = await fetch('/api/ai-chat/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({ message: message })
                });

                const data = await response.json();
                showTyping(false);

                // 3. Update UI (AI bubble)
                if (data.text) {
                    appendBubble('ai', data.text, data.eventIds);
                    renderChips(data.chips);
                }
            } catch (err) {
                showTyping(false);
                appendBubble('ai', "Sorry, I lost my connection. Try again?");
            }
        }

        function appendBubble(role, html, eventIds = []) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `ai-msg ai-msg-${role}`;
            
            msgDiv.innerHTML = `
                <div class="ai-bubble">${html}</div>
                <div class="ai-event-results-container"></div>
            `;

            // If Gemini recommended events, find them in your local data
            if (eventIds.length > 0 && typeof window.AI_GET_EVENTS === 'function') {
                const container = msgDiv.querySelector('.ai-event-results-container');
                const allEvents = window.AI_GET_EVENTS();
                
                eventIds.forEach(id => {
                    const event = allEvents.find(e => String(e.id) === String(id));
                    if (event) {
                        container.innerHTML += `
                            <div class="ai-event-card" onclick="window.viewEventDetails('${event.id}')">
                                <div class="ai-event-info">
                                    <strong>${event.title}</strong>
                                    <div class="ai-event-meta">${event.location} • ${event.ticket_price || 0} SAR</div>
                                </div>
                                <i class="fa-solid fa-chevron-right"></i>
                            </div>`;
                    }
                });
            }

            ui.messages.appendChild(msgDiv);
            ui.messages.scrollTop = ui.messages.scrollHeight;
        }

        function renderChips(chips) {
            ui.chips.innerHTML = '';
            (chips || []).forEach(chip => {
                const btn = document.createElement('button');
                btn.className = 'ai-chip';
                btn.innerText = chip.label;
                btn.onclick = () => sendMessage(chip.prompt);
                ui.chips.appendChild(btn);
            });
        }

        function showTyping(show) {
            const existing = document.getElementById('ai-typing-indicator');
            if (show && !existing) {
                const typing = document.createElement('div');
                typing.id = 'ai-typing-indicator';
                typing.className = 'ai-msg ai-msg-ai';
                typing.innerHTML = `<div class="ai-bubble">...</div>`;
                ui.messages.appendChild(typing);
            } else if (!show && existing) {
                existing.remove();
            }
        }

        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        return {
            init: function () {
                if (ui.form) ui.form.onsubmit = (e) => { e.preventDefault(); sendMessage(); };
                if (ui.closeBtn) ui.closeBtn.onclick = () => { ui.overlay.hidden = true; };
                if (ui.sparkleBtn) ui.sparkleBtn.onclick = () => { ui.overlay.hidden = false; };
            }
        };
    })();

    document.addEventListener('DOMContentLoaded', AIAssistant.init);
})();