/**
 * AI ASSISTANT (Eventia AI) - shared module
 *
 * Self-contained chat assistant that:
 * - reads events from a pluggable source (window.AI_GET_EVENTS),
 * - filters and ranks them against a free-text user query,
 * - persists conversations in localStorage on the user's browser only.
 *
 * To wire it up on a page:
 *   1. Drop the AI markup (sparkle button, hint, panel overlay) into the page.
 *   2. Define `window.AI_GET_EVENTS = function () { return [...]; }` so the
 *      module can read your events. Each event needs:
 *        { id, title, category, date, location, description, price }
 *      (`status`, `attendees`, `banner` are optional.)
 *   3. Optionally define `window.viewEventDetails(id)` to handle "View".
 *   4. Include this script. Initialization happens automatically.
 */

(function () {
    'use strict';

    const SAR_ICON = '<img src="' + (window.STATIC_URL || '/static/') +
        'assets/sar_symbol.svg" class="sar-icon" alt="SAR">';

    const categoryGradients = {
        'Conference': 'linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)',
        'Exhibition': 'linear-gradient(135deg, #8E2DE2, #4A00E0)',
        'Entertainment': 'linear-gradient(135deg, #eb3349, #f45c43)',
        'Workshop': 'linear-gradient(135deg, #11998e, #38ef7d)',
        'Sports': 'linear-gradient(135deg, #fc4a1a, #f7b733)',
        'Business': 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)',
        'Food & Culture': 'linear-gradient(135deg, #F09819, #EDDE5D)',
        'Technology': 'linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)',
        'Education': 'linear-gradient(135deg, #56ab2f, #a8e063)',
        'Culture': 'linear-gradient(135deg, #6441A5, #2a0845)',
        'Family': 'linear-gradient(135deg, #ff6a88, #ff99ac)',
        'Shopping': 'linear-gradient(135deg, #f953c6, #b91d73)',
        'Other': 'linear-gradient(135deg, #667eea, #764ba2)'
    };

    const categoryIcons = {
        'Conference': 'fa-microphone',
        'Exhibition': 'fa-store',
        'Entertainment': 'fa-masks-theater',
        'Workshop': 'fa-screwdriver-wrench',
        'Sports': 'fa-futbol',
        'Business': 'fa-briefcase',
        'Food & Culture': 'fa-utensils',
        'Technology': 'fa-laptop-code',
        'Education': 'fa-graduation-cap',
        'Culture': 'fa-landmark',
        'Family': 'fa-children',
        'Shopping': 'fa-bag-shopping',
        'Other': 'fa-calendar-day'
    };

    const AIAssistant = (function () {
        const CATEGORIES = [
            'Conference', 'Exhibition', 'Entertainment', 'Workshop',
            'Sports', 'Business', 'Food & Culture', 'Technology',
            'Education', 'Culture', 'Family', 'Shopping'
        ];
        const CATEGORY_SYNONYMS = {
            'Conference': ['conference', 'summit', 'meetup', 'talk', 'keynote', 'panel'],
            'Exhibition': ['exhibition', 'expo', 'gallery', 'showcase', 'fair'],
            'Entertainment': ['entertainment', 'show', 'comedy', 'theater', 'theatre', 'performance', 'concert'],
            'Workshop': ['workshop', 'hands-on', 'training', 'class', 'lesson'],
            'Sports': ['sports', 'sport', 'marathon', 'run', 'running', 'football', 'fitness', 'game', 'match'],
            'Business': ['business', 'leadership', 'entrepreneur', 'networking', 'career', 'finance', 'startup'],
            'Food & Culture': ['food', 'culinary', 'taste', 'cuisine', 'dining', 'foodie', 'restaurant'],
            'Technology': ['tech', 'technology', 'ai', 'coding', 'developer', 'robotics', 'software', 'it'],
            'Education': ['education', 'learning', 'course', 'academic', 'university', 'school', 'lecture'],
            'Culture': ['culture', 'cultural', 'heritage', 'art', 'arts', 'painting', 'design', 'music', 'festival'],
            'Family': ['family', 'kids', 'children', 'child', 'parent', 'family-friendly'],
            'Shopping': ['shopping', 'shop', 'market', 'mall', 'sale', 'bazaar']
        };
        const CITIES = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Al Ula', 'Dhahran', 'KAUST', 'KFUPM'];
        const MOOD_SYNONYMS = {
            fun: ['Entertainment', 'Sports', 'Culture', 'Family'],
            chill: ['Culture', 'Education', 'Food & Culture'],
            learn: ['Education', 'Technology', 'Business', 'Workshop', 'Conference'],
            network: ['Business', 'Technology', 'Conference']
        };

        let state = {
            history: [],
            sessionHistory: [],  // plain-text pairs sent to Gemini backend for memory
            lastQuery: null,
            opened: false,
            currentConvId: null,
            lastFollowUps: []
        };

        const CONV_STORAGE_KEY = 'eventia_ai_conversations';
        const MAX_STORED_CONVS = 50;

        let ui = null;
        let welcomeTemplate = '';
        function refs() {
            if (ui) return ui;
            ui = {
                root: document.getElementById('ai-assistant'),
                sparkleBtn: document.getElementById('ai-search-sparkle-btn'),
                sparkleNudge: document.getElementById('ai-sparkle-nudge'),
                nudgeCloseBtn: document.getElementById('ai-nudge-close'),
                searchInput: document.getElementById('landing-search'),
                closeBtn: document.getElementById('ai-close-btn'),
                resetBtn: document.getElementById('ai-reset-btn'),
                historyBtn: document.getElementById('ai-history-btn'),
                overlay: document.getElementById('ai-panel-overlay'),
                backdrop: document.getElementById('ai-panel-backdrop'),
                panel: document.getElementById('ai-panel'),
                messages: document.getElementById('ai-messages'),
                welcome: document.getElementById('ai-welcome'),
                chips: document.getElementById('ai-suggested-chips'),
                form: document.getElementById('ai-input-form'),
                input: document.getElementById('ai-input'),
                sendBtn: document.getElementById('ai-send-btn'),
                historyView: document.getElementById('ai-history-view'),
                historyList: document.getElementById('ai-history-list'),
                historyClearBtn: document.getElementById('ai-history-clear-btn')
            };
            if (ui.welcome) welcomeTemplate = ui.welcome.outerHTML;
            return ui;
        }

        function getEvents() {
            try {
                if (typeof window.AI_GET_EVENTS === 'function') {
                    const list = window.AI_GET_EVENTS();
                    return Array.isArray(list) ? list : [];
                }
            } catch (e) {
                console.error('AI_GET_EVENTS threw:', e);
            }
            return [];
        }

        function loadConversations() {
            try {
                const raw = localStorage.getItem(CONV_STORAGE_KEY);
                const list = raw ? JSON.parse(raw) : [];
                return Array.isArray(list) ? list : [];
            } catch (_) {
                return [];
            }
        }

        function saveConversations(list) {
            try {
                const trimmed = (list || []).slice(0, MAX_STORED_CONVS);
                localStorage.setItem(CONV_STORAGE_KEY, JSON.stringify(trimmed));
            } catch (_) { /* ignore quota errors */ }
        }

        function makeConvId() {
            return 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
        }

        function truncateTitle(text, max) {
            const s = (text || '').trim();
            if (s.length <= max) return s;
            return s.slice(0, max - 1).trimEnd() + '\u2026';
        }

        function persistMessage(role, data) {
            const all = loadConversations();
            let conv = null;
            if (state.currentConvId) {
                conv = all.find(c => c.id === state.currentConvId) || null;
            }
            if (!conv) {
                conv = {
                    id: makeConvId(),
                    title: role === 'user' ? truncateTitle(data.plainText || data.html, 60) : 'New conversation',
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    messages: []
                };
                state.currentConvId = conv.id;
                all.unshift(conv);
            }
            conv.messages.push({
                role,
                html: data.html || '',
                eventIds: Array.isArray(data.eventIds) ? data.eventIds : undefined,
                emptySuggest: data.emptySuggest || undefined,
                followUps: data.followUps || undefined
            });
            if (role === 'user' && (!conv.title || conv.title === 'New conversation')) {
                conv.title = truncateTitle(data.plainText || data.html, 60);
            }
            conv.updatedAt = Date.now();
            const filtered = all.filter(c => c.id !== conv.id);
            filtered.unshift(conv);
            saveConversations(filtered);
        }

        function deleteConversation(id) {
            const all = loadConversations().filter(c => c.id !== id);
            saveConversations(all);
            if (state.currentConvId === id) {
                state.currentConvId = null;
            }
        }

        function clearAllConversations() {
            saveConversations([]);
            state.currentConvId = null;
        }

        function formatRelativeTime(ts) {
            const diff = Date.now() - ts;
            const sec = Math.floor(diff / 1000);
            if (sec < 45) return 'Just now';
            const min = Math.floor(sec / 60);
            if (min < 60) return `${min}m ago`;
            const hr = Math.floor(min / 60);
            if (hr < 24) return `${hr}h ago`;
            const day = Math.floor(hr / 24);
            if (day === 1) return 'Yesterday';
            if (day < 7) return `${day}d ago`;
            return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        function escapeHtml(str) {
            return String(str || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function formatDate(dateStr) {
            if (!dateStr) return 'TBD';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        function isToday(dateStr) {
            const d = new Date(dateStr);
            const today = new Date();
            return d.toDateString() === today.toDateString();
        }

        function isThisWeekend(dateStr) {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return false;
            const today = new Date();
            const day = today.getDay();
            const daysUntilFri = (5 - day + 7) % 7;
            const friday = new Date(today);
            friday.setDate(today.getDate() + daysUntilFri);
            friday.setHours(0, 0, 0, 0);
            const sunday = new Date(friday);
            sunday.setDate(friday.getDate() + 2);
            sunday.setHours(23, 59, 59, 999);
            return d >= friday && d <= sunday;
        }

        function daysFromNow(dateStr, days) {
            const d = new Date(dateStr);
            const target = new Date();
            target.setHours(23, 59, 59, 999);
            target.setDate(target.getDate() + days);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return d >= now && d <= target;
        }

        function interpret(text) {
            const t = (text || '').toLowerCase();
            const q = {
                raw: text,
                categories: [],
                cities: [],
                timeframe: null,
                maxPrice: null,
                freeOnly: false,
                keywords: []
            };

            CATEGORIES.forEach(cat => {
                const syns = CATEGORY_SYNONYMS[cat] || [];
                if (syns.some(s => t.includes(s))) q.categories.push(cat);
            });
            Object.keys(MOOD_SYNONYMS).forEach(mood => {
                if (t.includes(mood)) {
                    MOOD_SYNONYMS[mood].forEach(c => {
                        if (!q.categories.includes(c)) q.categories.push(c);
                    });
                }
            });

            CITIES.forEach(city => {
                if (t.includes(city.toLowerCase())) q.cities.push(city);
            });

            if (/\btonight\b/.test(t)) q.timeframe = 'tonight';
            else if (/\btoday\b/.test(t)) q.timeframe = 'today';
            else if (/\bthis\s+weekend\b|\bweekend\b/.test(t)) q.timeframe = 'weekend';
            else if (/\bthis\s+week\b/.test(t)) q.timeframe = 'thisweek';
            else if (/\bnext\s+week\b/.test(t)) q.timeframe = 'nextweek';

            if (/\bfree\b|\bno\s*cost\b|\bno\s*charge\b/.test(t)) q.freeOnly = true;
            const priceMatch = t.match(/(?:under|below|less than|<=?)\s*(\d{2,5})/);
            if (priceMatch) q.maxPrice = parseInt(priceMatch[1], 10);
            else {
                const sarMatch = t.match(/(\d{2,5})\s*(sar|riyal|riyals|\u0631)/);
                if (sarMatch && /under|below|less than|cheap/.test(t)) q.maxPrice = parseInt(sarMatch[1], 10);
            }

            const stop = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'to', 'me', 'i', 'want', 'looking', 'find', 'show',
                'please', 'any', 'some', 'event', 'events', 'in', 'at', 'on', 'this', 'that', 'with', 'about',
                'like', 'near', 'around', 'can', 'you', 'help', 'today', 'tonight', 'weekend', 'week', 'next',
                'free', 'under', 'below', 'less', 'than', 'cheap', 'sar', 'riyal', 'riyals']);
            q.keywords = t.split(/[^a-z0-9\u0600-\u06FF]+/)
                .filter(w => w && w.length > 2 && !stop.has(w)
                    && !CATEGORIES.some(c => c.toLowerCase() === w)
                    && !CITIES.some(c => c.toLowerCase() === w));

            return q;
        }

        function matches(evt, q) {
            if (evt.status === 'Rejected' || evt.status === 'Pending') return false;

            if (q.categories.length && !q.categories.includes(evt.category)) return false;

            if (q.cities.length) {
                const loc = (evt.location || '').toLowerCase();
                const hit = q.cities.some(c => loc.includes(c.toLowerCase()));
                if (!hit) return false;
            }

            if (q.timeframe) {
                switch (q.timeframe) {
                    case 'today':
                    case 'tonight':
                        if (!isToday(evt.date)) return false;
                        break;
                    case 'weekend':
                        if (!isThisWeekend(evt.date)) return false;
                        break;
                    case 'thisweek':
                        if (!daysFromNow(evt.date, 7)) return false;
                        break;
                    case 'nextweek':
                        if (!daysFromNow(evt.date, 14) || daysFromNow(evt.date, 7)) return false;
                        break;
                }
            }

            const priceNum = parseFloat(evt.price) || 0;
            if (q.freeOnly && priceNum > 0) return false;
            if (q.maxPrice !== null && priceNum > q.maxPrice) return false;

            if (q.keywords.length) {
                const haystack = [evt.title, evt.description, evt.location].join(' ').toLowerCase();
                const matched = q.keywords.filter(k => haystack.includes(k));
                if (matched.length === 0 && !q.categories.length && !q.cities.length
                    && !q.timeframe && !q.freeOnly && q.maxPrice === null) return false;
            }

            return true;
        }

        function rankEvents(list) {
            const now = Date.now();
            return list.slice().sort((a, b) => {
                const da = new Date(a.date).getTime() - now;
                const db = new Date(b.date).getTime() - now;
                const aFuture = da >= 0 ? da : Infinity;
                const bFuture = db >= 0 ? db : Infinity;
                if (aFuture !== bFuture) return aFuture - bFuture;
                return (b.attendees || 0) - (a.attendees || 0);
            });
        }

        function summarize(q, total) {
            const bits = [];
            if (q.categories.length === 1) bits.push(`<strong>${escapeHtml(q.categories[0])}</strong>`);
            else if (q.categories.length > 1) bits.push(`<strong>${q.categories.map(escapeHtml).join(' / ')}</strong>`);
            else bits.push('events');

            if (q.cities.length) bits.push(`in <strong>${q.cities.map(escapeHtml).join(' or ')}</strong>`);
            if (q.timeframe === 'today' || q.timeframe === 'tonight') bits.push('happening <strong>today</strong>');
            if (q.timeframe === 'weekend') bits.push('<strong>this weekend</strong>');
            if (q.timeframe === 'thisweek') bits.push('<strong>this week</strong>');
            if (q.timeframe === 'nextweek') bits.push('<strong>next week</strong>');
            if (q.freeOnly) bits.push('that are <strong>free</strong>');
            else if (q.maxPrice !== null) bits.push(`under <strong>${q.maxPrice} SAR</strong>`);

            const prefix = total === 0
                ? `I couldn't find `
                : (total === 1 ? `I found <strong>1</strong> match &mdash; ` : `I found <strong>${total}</strong> `);
            return prefix + bits.join(' ') + (total === 0 ? ' matching that yet.' : '.');
        }

        function buildFollowUps(q, results) {
            const chips = [];
            if (results.length > 3) chips.push({ label: 'Show more', icon: 'fa-list', prompt: `${q.raw || ''} (show more)` });
            if (!q.freeOnly && results.some(e => parseFloat(e.price) > 0)) {
                chips.push({ label: 'Only free ones', icon: 'fa-tag', prompt: `${q.raw || ''} free only` });
            }
            if (!q.cities.length) chips.push({ label: 'In Riyadh only', icon: 'fa-location-dot', prompt: `${q.raw || ''} in Riyadh` });
            if (q.timeframe !== 'weekend') chips.push({ label: 'This weekend', icon: 'fa-calendar-week', prompt: `${q.raw || ''} this weekend` });
            if (!q.categories.length) chips.push({ label: 'Surprise me', icon: 'fa-shuffle', prompt: 'surprise me with something fun' });
            return chips.slice(0, 4);
        }

        // ── REAL API CALL TO DJANGO + GEMINI ──────────────────────────────────
        // The old local keyword-matcher has been removed. All understanding
        // now happens server-side via Gemini, which has the full event database
        // including descriptions, organizers, vendors, prices and categories.
        async function sendMessage(userText) {
            const csrftoken = window.CSRF_TOKEN
                || document.querySelector('[name=csrfmiddlewaretoken]')?.value
                || '';

            const response = await fetch('/api/ai-assistant/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    message: userText,
                    history: state.sessionHistory   // gives Gemini memory of the conversation
                })
            });

            if (!response.ok) {
    // Try to read the error body before throwing
    let errMsg = `Server error ${response.status}`;
    try {
        const errData = await response.json();
        if (errData.error) errMsg = errData.error;
    } catch (_) {}
    throw new Error(errMsg);
}

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // Map the integer IDs Gemini returned to full event objects
            // so the card renderer can display them
            const allEvents = getEvents();
            const matchedEvents = [];
            if (Array.isArray(data.event_ids)) {
                data.event_ids.forEach(id => {
                    const evt = allEvents.find(e => String(e.id) === String(id));
                    if (evt) matchedEvents.push(evt);
                });
            }

            // Build quick-reply chips from what Gemini returned
            // (simple context-aware suggestions that don't need the old matcher)
            const followUps = buildSmartFollowUps(userText, matchedEvents);

            return {
                text: data.reply || "Here's what I found:",
                events: matchedEvents,
                followUps: followUps,
                emptySuggest: matchedEvents.length === 0 && data.event_ids && data.event_ids.length === 0
                    ? null   // Gemini already explained why in the reply text
                    : null
            };
        }

        // Lightweight chip suggestions that don't depend on the old keyword parser
        function buildSmartFollowUps(userText, results) {
            const t = (userText || '').toLowerCase();
            const chips = [];

            // If events were returned, offer refinement options
            if (results.length > 0) {
                const hasPaid = results.some(e => parseFloat(e.price) > 0);
                if (hasPaid) chips.push({ label: 'Free events only', icon: 'fa-tag', prompt: 'show me only free events' });
                chips.push({ label: 'Events in Riyadh', icon: 'fa-location-dot', prompt: 'events in Riyadh' });
            }

            // Always offer common discovery prompts if not already asking for them
            if (!t.includes('this weekend') && !t.includes('weekend')) {
                chips.push({ label: 'This weekend', icon: 'fa-calendar-week', prompt: 'what events are this weekend?' });
            }
            if (!t.includes('tech') && !t.includes('technology')) {
                chips.push({ label: 'Tech events', icon: 'fa-laptop-code', prompt: 'find me technology events' });
            }
            if (!t.includes('free')) {
                chips.push({ label: 'Free events', icon: 'fa-gift', prompt: 'show me free events' });
            }

            return chips.slice(0, 4);
        }

        function buildEmptySuggest(q) {
            const alt = [];
            if (q.categories.length) alt.push('removing the category filter');
            if (q.cities.length) alt.push('trying a different city');
            if (q.maxPrice !== null || q.freeOnly) alt.push('widening your budget');
            if (q.timeframe) alt.push('looking at a later date');
            if (alt.length === 0) return 'Try describing what you enjoy &mdash; a category, a mood, or a city.';
            return 'Want to try ' + alt.join(' or ') + '?';
        }

        function categoryGradientFor(cat) { return categoryGradients[cat] || categoryGradients['Other']; }
        function categoryIconFor(cat) { return categoryIcons[cat] || 'fa-calendar'; }

        function renderEventCard(evt) {
            const priceNum = parseFloat(evt.price) || 0;
            const priceHtml = priceNum > 0
                ? `<div class="ai-event-price">${priceNum} ${SAR_ICON}</div>`
                : `<div class="ai-event-price free"><i class="fa-solid fa-gift"></i> Free</div>`;

            return `
                <div class="ai-event-card" data-event-id="${escapeHtml(evt.id)}" role="button" tabindex="0">
                    <div class="ai-event-thumb" style="background: ${categoryGradientFor(evt.category)};">
                        <i class="fa-solid ${categoryIconFor(evt.category)}"></i>
                    </div>
                    <div class="ai-event-info">
                        <h4 class="ai-event-title">${escapeHtml(evt.title)}</h4>
                        <div class="ai-event-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(formatDate(evt.date))}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(evt.location || 'TBD')}</span>
                        </div>
                        <span class="ai-event-category-pill">${escapeHtml(evt.category || 'Event')}</span>
                    </div>
                    <div class="ai-event-actions">
                        ${priceHtml}
                        <button type="button" class="ai-event-view-btn" data-view-event="${escapeHtml(evt.id)}">
                            View <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        function appendMessage(role, html, opts = {}) {
            const r = refs();
            const row = document.createElement('div');
            row.className = `ai-msg ai-msg-${role}`;

            const avatar = document.createElement('div');
            avatar.className = 'ai-msg-avatar';
            avatar.innerHTML = role === 'ai'
                ? '<i class="fa-solid fa-wand-magic-sparkles"></i>'
                : '<i class="fa-solid fa-user"></i>';

            const body = document.createElement('div');
            body.className = 'ai-msg-body';

            const bubble = document.createElement('div');
            bubble.className = 'ai-bubble';
            bubble.innerHTML = html;
            body.appendChild(bubble);

            if (opts.events && opts.events.length) {
                const list = document.createElement('div');
                list.className = 'ai-event-list';
                list.innerHTML = opts.events.map(renderEventCard).join('');
                body.appendChild(list);
            }

            if (opts.emptySuggest) {
                const s = document.createElement('div');
                s.className = 'ai-empty-suggest';
                s.innerHTML = opts.emptySuggest;
                body.appendChild(s);
            }

            row.appendChild(avatar);
            row.appendChild(body);
            r.messages.appendChild(row);

            state.history.push({ role, html, events: opts.events || [] });
            scrollToBottom();
        }

        function scrollToBottom() {
            const r = refs();
            requestAnimationFrame(() => {
                r.messages.scrollTop = r.messages.scrollHeight;
            });
        }

        function showTyping() {
            const r = refs();
            removeTyping();
            const row = document.createElement('div');
            row.className = 'ai-msg ai-msg-ai';
            row.id = 'ai-typing-row';
            row.innerHTML = `
                <div class="ai-msg-avatar"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                <div class="ai-msg-body">
                    <div class="ai-typing" aria-label="Eventia AI is typing">
                        <span class="ai-typing-dot"></span>
                        <span class="ai-typing-dot"></span>
                        <span class="ai-typing-dot"></span>
                    </div>
                </div>
            `;
            r.messages.appendChild(row);
            scrollToBottom();
        }

        function removeTyping() {
            const existing = document.getElementById('ai-typing-row');
            if (existing) existing.remove();
        }

        function renderChips(chips) {
            const r = refs();
            r.chips.innerHTML = '';
            if (!chips || chips.length === 0) return;
            chips.forEach(c => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'ai-chip';
                btn.dataset.prompt = c.prompt;
                btn.innerHTML = `<i class="fa-solid ${c.icon}"></i> ${escapeHtml(c.label)}`;
                btn.addEventListener('click', () => submitPrompt(c.prompt));
                r.chips.appendChild(btn);
            });
        }

        function hasWelcome() {
            const w = document.getElementById('ai-welcome');
            return !!w && !w.classList.contains('ai-welcome-leaving');
        }

        function hideWelcome() {
            const w = document.getElementById('ai-welcome');
            if (!w) return;
            w.classList.add('ai-welcome-leaving');
            setTimeout(() => { if (w.parentNode) w.parentNode.removeChild(w); }, 260);
        }

        function restoreWelcome() {
            const r = refs();
            const existing = document.getElementById('ai-welcome');
            if (existing) existing.remove();
            if (welcomeTemplate) {
                r.messages.insertAdjacentHTML('afterbegin', welcomeTemplate);
            }
        }

        async function submitPrompt(text) {
            const clean = (text || '').trim();
            if (!clean) return;
            const r = refs();

            if (r.root && r.root.dataset.view === 'history') showChatView();
            if (hasWelcome()) hideWelcome();

            const userHtml = escapeHtml(clean);
            appendMessage('user', userHtml);
            persistMessage('user', { html: userHtml, plainText: clean });

            r.input.value = '';
            r.sendBtn.disabled = true;
            r.chips.innerHTML = '';
            showTyping();
            try {
                const reply = await sendMessage(clean);
                removeTyping();
                appendMessage('ai', reply.text, { events: reply.events, emptySuggest: reply.emptySuggest });
                renderChips(reply.followUps);
                state.lastFollowUps = reply.followUps || [];

                // Track AI reply text for Gemini's memory (strip HTML tags for clean text)
                const replyPlain = reply.text.replace(/<[^>]+>/g, '');
                state.sessionHistory.push({ role: 'ai', text: replyPlain });

                persistMessage('ai', {
                    html: reply.text,
                    eventIds: (reply.events || []).map(e => e.id),
                    emptySuggest: reply.emptySuggest,
                    followUps: reply.followUps
                });
            } catch (err) {
                removeTyping();
                // Remove the user message we just pushed since the call failed
                state.sessionHistory.pop();
                const failHtml = 'Something went wrong on my side — please try again in a moment.';
                appendMessage('ai', failHtml);
                persistMessage('ai', { html: failHtml });
            } finally {
                r.sendBtn.disabled = false;
                r.input.focus();
            }
        }

        function showHistoryView() {
            const r = refs();
            if (!r.root) return;
            r.root.dataset.view = 'history';
            if (r.messages) r.messages.hidden = true;
            if (r.chips) r.chips.hidden = true;
            if (r.form) r.form.hidden = true;
            if (r.historyView) r.historyView.hidden = false;
            renderHistoryList();
        }

        function showChatView() {
            const r = refs();
            if (!r.root) return;
            r.root.dataset.view = 'chat';
            if (r.messages) r.messages.hidden = false;
            if (r.chips) r.chips.hidden = false;
            if (r.form) r.form.hidden = false;
            if (r.historyView) r.historyView.hidden = true;
        }

        function toggleHistoryView() {
            const r = refs();
            if (r.root && r.root.dataset.view === 'history') {
                showChatView();
            } else {
                showHistoryView();
            }
        }

        function renderHistoryList() {
            const r = refs();
            if (!r.historyList) return;
            const all = loadConversations();
            r.historyList.innerHTML = '';

            if (r.historyClearBtn) r.historyClearBtn.hidden = all.length === 0;

            if (all.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'ai-history-empty';
                empty.innerHTML = `
                    <div class="ai-history-empty-icon"><i class="fa-solid fa-comments"></i></div>
                    <h5>No past conversations yet</h5>
                    <p>Once you start chatting, your conversations will appear here so you can pick up where you left off.</p>
                `;
                r.historyList.appendChild(empty);
                return;
            }

            all.forEach(conv => {
                const item = document.createElement('div');
                item.className = 'ai-history-item';
                if (state.currentConvId === conv.id) item.classList.add('ai-history-item-active');
                item.tabIndex = 0;
                item.dataset.convId = conv.id;

                const msgCount = (conv.messages || []).length;
                item.innerHTML = `
                    <div class="ai-history-item-icon" aria-hidden="true">
                        <i class="fa-solid fa-message"></i>
                    </div>
                    <div class="ai-history-item-body">
                        <div class="ai-history-item-title">${escapeHtml(conv.title || 'Conversation')}</div>
                        <div class="ai-history-item-meta">
                            <span class="ai-history-item-time">${escapeHtml(formatRelativeTime(conv.updatedAt || conv.createdAt))}</span>
                            <span class="dot"></span>
                            <span class="ai-history-item-count">
                                <i class="fa-regular fa-comment"></i> ${msgCount} ${msgCount === 1 ? 'message' : 'messages'}
                            </span>
                        </div>
                    </div>
                    <button type="button" class="ai-history-item-delete" title="Delete conversation" aria-label="Delete conversation">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                `;

                item.addEventListener('click', (e) => {
                    if (e.target.closest('.ai-history-item-delete')) return;
                    loadConversationIntoChat(conv.id);
                });
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        loadConversationIntoChat(conv.id);
                    }
                });

                const delBtn = item.querySelector('.ai-history-item-delete');
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                    renderHistoryList();
                });

                r.historyList.appendChild(item);
            });
        }

        function replayMessage(msg) {
            if (msg.role === 'user') {
                appendMessage('user', msg.html || '');
                return;
            }
            const opts = {};
            if (msg.emptySuggest) opts.emptySuggest = msg.emptySuggest;
            if (Array.isArray(msg.eventIds) && msg.eventIds.length) {
                const events = getEvents();
                const resolved = msg.eventIds.map(id => events.find(e => e.id === id)).filter(Boolean);
                if (resolved.length) opts.events = resolved;
            }
            appendMessage('ai', msg.html || '', opts);
        }

        function loadConversationIntoChat(id) {
            const r = refs();
            const all = loadConversations();
            const conv = all.find(c => c.id === id);
            if (!conv) return;

            state.currentConvId = id;
            state.history = [];
            r.messages.innerHTML = '';
            r.chips.innerHTML = '';

            (conv.messages || []).forEach(m => replayMessage(m));

            const lastAi = [...(conv.messages || [])].reverse().find(m => m.role === 'ai');
            if (lastAi && Array.isArray(lastAi.followUps) && lastAi.followUps.length) {
                renderChips(lastAi.followUps);
                state.lastFollowUps = lastAi.followUps;
            }

            showChatView();
            setTimeout(() => r.input.focus(), 50);
        }

        function openAssistant(initialPrompt) {
            const r = refs();
            if (!r.overlay) return;
            r.overlay.hidden = false;
            document.body.classList.add('ai-open');
            if (r.root) r.root.dataset.state = 'open';
            state.opened = true;
            showChatView();

            setTimeout(() => {
                if (initialPrompt) {
                    submitPrompt(initialPrompt);
                } else {
                    r.input.focus();
                }
            }, 150);
        }

        function closeAssistant() {
            const r = refs();
            if (!r.overlay) return;
            r.overlay.hidden = true;
            document.body.classList.remove('ai-open');
            if (r.root) r.root.dataset.state = 'collapsed';
            state.opened = false;
        }

        function resetConversation() {
            const r = refs();
            r.messages.innerHTML = '';
            r.chips.innerHTML = '';
            state.history = [];
            state.sessionHistory = [];  // clear Gemini memory too
            state.lastQuery = null;
            state.currentConvId = null;
            state.lastFollowUps = [];
            restoreWelcome();
            showChatView();
            r.input.focus();
        }

        const NUDGE_KEY = 'eventia_ai_nudge_dismissed';

        function dismissNudge() {
            const r = refs();
            if (r.sparkleNudge) r.sparkleNudge.hidden = true;
            try { localStorage.setItem(NUDGE_KEY, '1'); } catch (_) {}
        }

        function initNudge() {
            const r = refs();
            if (!r.sparkleNudge) return;
            const wasDismissed = localStorage.getItem(NUDGE_KEY) === '1';
            if (wasDismissed) {
                r.sparkleNudge.hidden = true;
                return;
            }
            r.sparkleNudge.hidden = false;
            if (r.nudgeCloseBtn) {
                r.nudgeCloseBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dismissNudge();
                });
            }
        }

        function init() {
            const r = refs();
            if (!r.root) return;

            if (r.sparkleBtn) {
                r.sparkleBtn.addEventListener('click', () => {
                    const typed = (r.searchInput && r.searchInput.value || '').trim();
                    dismissNudge();
                    openAssistant(typed || null);
                });
            }

            const hintLink = document.getElementById('ai-hint-link');
            if (hintLink) {
                hintLink.addEventListener('click', () => {
                    dismissNudge();
                    openAssistant(null);
                });
            }

            initNudge();

            if (r.closeBtn) r.closeBtn.addEventListener('click', closeAssistant);
            if (r.resetBtn) r.resetBtn.addEventListener('click', resetConversation);

            if (r.historyBtn) {
                r.historyBtn.addEventListener('click', toggleHistoryView);
            }
            if (r.historyClearBtn) {
                r.historyClearBtn.addEventListener('click', () => {
                    if (!confirm('Clear all past conversations? This cannot be undone.')) return;
                    clearAllConversations();
                    renderHistoryList();
                });
            }

            if (r.backdrop) {
                r.backdrop.addEventListener('click', closeAssistant);
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && state.opened) {
                    e.preventDefault();
                    closeAssistant();
                }
            });

            if (r.form) {
                r.form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    submitPrompt(r.input.value);
                });
            }

            if (r.input) {
                r.input.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        closeAssistant();
                    }
                });
            }

            if (r.messages) {
                r.messages.addEventListener('click', (e) => {
                    const viewBtn = e.target.closest('[data-view-event]');
                    if (viewBtn) {
                        e.stopPropagation();
                        const id = viewBtn.dataset.viewEvent;
                        if (typeof window.viewEventDetails === 'function') window.viewEventDetails(id);
                        return;
                    }
                    const card = e.target.closest('.ai-event-card');
                    if (card) {
                        const id = card.dataset.eventId;
                        if (typeof window.viewEventDetails === 'function') window.viewEventDetails(id);
                    }
                });
                r.messages.addEventListener('keydown', (e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    const card = e.target.closest('.ai-event-card');
                    if (card) {
                        e.preventDefault();
                        const id = card.dataset.eventId;
                        if (typeof window.viewEventDetails === 'function') window.viewEventDetails(id);
                    }
                });
            }
        }

        return {
            init,
            open: openAssistant,
            close: closeAssistant,
            ask: submitPrompt
        };
    })();

    window.AIAssistant = AIAssistant;
    window.openAIAssistant = AIAssistant.open;
    window.askAIAssistant = AIAssistant.ask;

    function bootstrap() {
        if (document.getElementById('ai-assistant')) {
            AIAssistant.init();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
