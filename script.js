/* ============================================
   Gemma Chat Interface — Application Logic
   Powered by Ollama + Gemma 4
   ============================================ */

'use strict';

// ============================================
// Model Name Mapping
// ============================================

const MODEL_MAP = {
  'gemma-4': 'gemma4:latest',
  'gemma-4-light': 'gemma4:e4b',
  'gemma-4-pro': 'gemma4:latest',
};

// ============================================
// State
// ============================================

const state = {
  messages: [],
  isTyping: false,
  conversationId: 1,
  chatCount: 1,
  hasSentMessages: false,
};

// ============================================
// DOM References
// ============================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const dom = {
  messagesContainer: $('#messagesContainer'),
  chatInput: $('#chatInput'),
  sendBtn: $('#sendBtn'),
  typingIndicator: $('#typingIndicator'),
  welcomeScreen: $('#welcomeScreen'),
  suggestionChips: $('#suggestionChips'),
  chatHistory: $('#chatHistory'),
  newChatBtn: $('#newChatBtn'),
  clearBtn: $('#clearBtn'),
  modelSelect: $('#modelSelect'),
  chatArea: $('.chat-area'),
};

// ============================================
// Utility Functions
// ============================================

function scrollToBottom(smooth = true) {
  const { messagesContainer } = dom;
  requestAnimationFrame(() => {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    });
  });
}

function formatTimestamp() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// Markdown to HTML (simple renderer)
// ============================================

function renderMarkdown(text) {
  let html = escapeHtml(text);

  // Step 1: Extract code blocks and replace with placeholders
  const codeBlocks = [];
  let placeholderId = 0;
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const langClass = lang ? ` class="language-${lang}"` : '';
    const block = `<pre><code${langClass}>${code.trim()}</code></pre>`;
    const id = `%%CODEBLOCK${placeholderId++}%%`;
    codeBlocks[id] = block;
    return id;
  });

  // Step 2: Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Step 3: Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Step 4: Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Step 5: Horizontal rules
  html = html.replace(/^---+$/gm, '<hr>');

  // Step 6: Headers
  html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^## (.+)$/gm, '<h3>$1</h3>');

  // Step 7: Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Step 8: Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ol>$&</ol>');

  // Step 9: Split into paragraphs by double newlines
  const parts = html.split(/\n\n+/);
  html = parts
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return '';
      // Single newlines within a paragraph become <br>
      const withBreaks = trimmed.replace(/\n/g, '<br>');
      // Don't wrap if it's already block-level HTML
      if (/^<(pre|ul|ol|h[34]|hr|table)/.test(withBreaks)) {
        return withBreaks;
      }
      return `<p>${withBreaks}</p>`;
    })
    .join('\n');

  // Step 10: Restore code blocks
  html = html.replace(/%%CODEBLOCK\d+%%/g, (match) => codeBlocks[match] || match);

  return html;
}

// ============================================
// Generate Suggested Follow-ups
// ============================================

function generateFollowups() {
  const suggestions = [
    'Tell me more about that',
    'Can you give me an example?',
    'What are the alternatives?',
    "Explain it like I'm 5",
    'What should I learn next?',
    'Show me some code',
  ];

  // Pick 3 random suggestions
  const shuffled = [...suggestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// ============================================
// Add Message to DOM
// ============================================

function addMessageToDOM(role, content, isStreaming = false) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.dataset.messageId = Date.now();

  const avatar = role === 'assistant'
    ? `<div class="message-avatar">&#9670;</div>`
    : `<div class="message-avatar">U</div>`;

  const bubbleContent = role === 'assistant' && !isStreaming
    ? renderMarkdown(content)
    : role === 'user'
      ? `<p>${escapeHtml(content)}</p>`
      : content; // raw text for streaming

  div.innerHTML = `
    ${avatar}
    <div class="message-content">
      <div class="message-bubble">${bubbleContent}</div>
      <span class="message-timestamp">${formatTimestamp()}</span>
    </div>
  `;

  dom.messagesContainer.appendChild(div);
  scrollToBottom();

  return div;
}

// ============================================
// Send Message (now calls Ollama via backend)
// ============================================

async function sendMessage(text) {
  const message = text.trim();
  if (!message || state.isTyping) return;

  // Hide welcome screen
  dom.welcomeScreen.style.display = 'none';

  // Track that user sent messages (for New Chat behavior)
  if (!state.hasSentMessages) {
    state.hasSentMessages = true;
  }

  // Add user message to DOM and state
  addMessageToDOM('user', message);
  state.messages.push({ role: 'user', content: message });

  // Clear input & disable
  dom.chatInput.value = '';
  dom.sendBtn.disabled = true;
  dom.chatInput.style.height = 'auto';
  state.isTyping = true;

  // Show typing indicator while waiting for first chunk
  dom.typingIndicator.classList.remove('hidden');
  scrollToBottom();

  try {
    // Determine model from selector
    const uiModel = dom.modelSelect.value;
    const ollamaModel = MODEL_MAP[uiModel] || 'gemma4:latest';

    // Send request to our backend (which proxies to Ollama)
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: state.messages,
        model: ollamaModel,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error (${response.status})`);
    }

    // Hide typing indicator now that we're about to receive data
    dom.typingIndicator.classList.add('hidden');

    // Create the assistant message element with just a cursor
    const msgElement = addMessageToDOM('assistant', '', true);
    const bubble = msgElement.querySelector('.message-bubble');
    bubble.innerHTML = '<span class="typing-cursor"></span>';

    // Read the streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.error) {
              throw new Error(data.error);
            }

            if (data.content) {
              fullText += data.content;
              // Show plain text with blinking cursor
              const displayText = escapeHtml(fullText);
              bubble.innerHTML = `<p>${displayText}</p><span class="typing-cursor"></span>`;
              scrollToBottom();
            }

            if (data.done) {
              // Streaming complete — render full markdown
              bubble.innerHTML = renderMarkdown(fullText);
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    }

    // Add follow-up suggestions
    addFollowups(msgElement);
    state.messages.push({ role: 'assistant', content: fullText });

  } catch (error) {
    // Hide typing indicator
    dom.typingIndicator.classList.add('hidden');

    // Show error message
    const errorText = `Sorry, I couldn't reach the Gemma 4 model.\n\n**Possible causes:**\n- Ollama is not running (start it first)\n- The backend server is down\n- Network issue\n\n**Error details:** ${escapeHtml(error.message)}`;
    const msgElement = addMessageToDOM('assistant', '');
    msgElement.querySelector('.message-bubble').innerHTML = renderMarkdown(errorText);
    state.messages.push({ role: 'assistant', content: errorText });
  }

  state.isTyping = false;

  // Re-enable input
  dom.sendBtn.disabled = !dom.chatInput.value.trim();
  dom.chatInput.focus();

  // Scroll after everything
  scrollToBottom();
}

// ============================================
// Add Follow-up Suggestions
// ============================================

function addFollowups(messageElement) {
  const contentDiv = messageElement.querySelector('.message-content');
  const followups = generateFollowups();

  const container = document.createElement('div');
  container.className = 'suggested-followups';

  followups.forEach((text) => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = text;
    chip.addEventListener('click', () => {
      dom.chatInput.value = text;
      dom.sendBtn.disabled = false;
      dom.chatInput.dispatchEvent(new Event('input'));
      sendMessage(text);
    });
    container.appendChild(chip);
  });

  contentDiv.appendChild(container);
  scrollToBottom();
}

// ============================================
// New Conversation
// ============================================

function newConversation() {
  // Don't create a new empty conversation if we're already on an empty one
  if (state.messages.length === 0 && dom.welcomeScreen.style.display !== 'none') return;

  // Clear messages from DOM
  dom.messagesContainer.querySelectorAll('.message, .suggested-followups').forEach((el) => el.remove());

  // Only add to sidebar history if messages were actually sent
  if (state.hasSentMessages) {
    addHistoryItem(`Conversation ${state.chatCount}`);
    state.chatCount++;
  }

  // Reset state
  state.messages = [];
  state.isTyping = false;
  state.conversationId++;
  state.hasSentMessages = false;

  // Show welcome screen
  dom.welcomeScreen.style.display = 'flex';

  // Hide typing indicator
  dom.typingIndicator.classList.add('hidden');

  // Enable input
  dom.chatInput.value = '';
  dom.sendBtn.disabled = true;
  dom.chatInput.style.height = 'auto';
  dom.chatInput.focus();

  // Activate the newest history item
  const firstItem = dom.chatHistory.querySelector('.history-item:not([data-permanent])');
  dom.chatHistory.querySelectorAll('.history-item').forEach((item) => item.classList.remove('active'));
  if (firstItem) firstItem.classList.add('active');
}

// ============================================
// Add History Item
// ============================================

function addHistoryItem(title) {
  const div = document.createElement('div');
  div.className = 'history-item active';
  div.dataset.id = state.conversationId;
  div.innerHTML = `
    <svg class="history-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    <span class="history-title">${escapeHtml(title)}</span>
  `;

  div.addEventListener('click', () => {
    dom.chatHistory.querySelectorAll('.history-item').forEach((item) => item.classList.remove('active'));
    div.classList.add('active');
  });

  // Insert at the top of history (after the "New conversation" permanent item)
  const permItem = dom.chatHistory.querySelector('[data-permanent]');
  if (permItem && permItem.nextSibling) {
    dom.chatHistory.insertBefore(div, permItem.nextSibling);
  } else {
    dom.chatHistory.insertBefore(div, dom.chatHistory.firstChild);
  }
}

// ============================================
// Clear Conversation
// ============================================

function clearConversation() {
  dom.messagesContainer.querySelectorAll('.message').forEach((el) => el.remove());
  state.messages = [];
  state.isTyping = false;
  state.hasSentMessages = false;
  dom.welcomeScreen.style.display = 'flex';
  dom.typingIndicator.classList.add('hidden');
  dom.chatInput.value = '';
  dom.sendBtn.disabled = true;
  dom.chatInput.style.height = 'auto';
  dom.chatInput.focus();
  scrollToBottom();
}

// ============================================
// Connection Status Check
// ============================================

async function checkConnection() {
  try {
    const response = await fetch('/api/status');
    const data = await response.json();

    if (data.available && data.hasGemma) {
      console.log('%c\u2713 Gemma 4 is ready', 'color: #4ade80; font-weight: bold;');
    } else if (data.available) {
      console.warn('%cGemma model not found. Available: ' + data.models.join(', '), 'color: #fbbf24;');
    } else {
      console.warn('%cOllama is not running. Start it with: ollama serve', 'color: #fbbf24;');
    }
  } catch {
    console.warn('%cBackend server not reachable. Make sure the server is running.', 'color: #ef4444;');
  }
}

// ============================================
// Input Event Handlers
// ============================================

// Auto-resize textarea
dom.chatInput.addEventListener('input', () => {
  dom.chatInput.style.height = 'auto';
  dom.chatInput.style.height = Math.min(dom.chatInput.scrollHeight, 150) + 'px';
  dom.sendBtn.disabled = !dom.chatInput.value.trim() || state.isTyping;
});

// Send on Enter (Shift+Enter for new line)
dom.chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (dom.chatInput.value.trim() && !state.isTyping) {
      sendMessage(dom.chatInput.value);
    }
  }
});

// Send button click
dom.sendBtn.addEventListener('click', () => {
  if (dom.chatInput.value.trim() && !state.isTyping) {
    sendMessage(dom.chatInput.value);
  }
});

// Suggestion chips (welcome screen)
dom.suggestionChips.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (chip && chip.dataset.prompt) {
    sendMessage(chip.dataset.prompt);
  }
});

// New chat button
dom.newChatBtn.addEventListener('click', newConversation);

// Clear button
dom.clearBtn.addEventListener('click', clearConversation);

// Listen for follow-up chip clicks (delegated)
dom.messagesContainer.addEventListener('click', (e) => {
  const chip = e.target.closest('.suggested-followups .chip');
  if (chip && !state.isTyping) {
    sendMessage(chip.textContent);
  }
});

// ============================================
// Scroll to Bottom Detection
// ============================================

// Create scroll-to-bottom button inside the chat area
const scrollBtn = document.createElement('button');
scrollBtn.className = 'scroll-bottom-btn';
scrollBtn.setAttribute('aria-label', 'Scroll to bottom');
scrollBtn.innerHTML = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>`;
scrollBtn.addEventListener('click', () => scrollToBottom(true));
dom.chatArea.appendChild(scrollBtn);

// Show/hide scroll button based on scroll position
dom.messagesContainer.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = dom.messagesContainer;
  const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
  scrollBtn.classList.toggle('visible', !isNearBottom);
});

// ============================================
// Model Select
// ============================================

dom.modelSelect.addEventListener('change', () => {
  const selected = dom.modelSelect.value;
  console.log(`Model switched to: ${MODEL_MAP[selected] || selected}`);
});

// ============================================
// Init
// ============================================

// Mark the first history item as permanent
const firstHistoryItem = dom.chatHistory.querySelector('.history-item');
if (firstHistoryItem) {
  firstHistoryItem.dataset.permanent = 'true';
}

// Focus input on load
dom.chatInput.focus();

// Check connection status
checkConnection();

console.log('%c\u2666 Gemma Chat %c v2.0 — Powered by Ollama', 'color: #7c6ff7; font-weight: bold; font-size: 14px;', 'color: #a0a0c0; font-size: 12px;');
