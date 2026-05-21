/* ============================================
   Gemma Chat Interface — Application Logic
   ============================================ */

'use strict';

// ============================================
// Mock Responses
// ============================================

const MOCK_RESPONSES = [
  {
    keywords: ['quantum', 'computing', 'physics'],
    response: `That's a fascinating topic! Let me break it down.

**Quantum computing** leverages the principles of quantum mechanics to process information in fundamentally new ways.

### Key Concepts:
- **Qubits**: Unlike classical bits (0 or 1), qubits can exist in **superposition** — being both 0 and 1 simultaneously
- **Entanglement**: Two qubits can be linked so that the state of one instantly affects the other, no matter the distance
- **Quantum gates**: Operations that manipulate qubits, similar to logic gates in classical computers

### Why It Matters:
Quantum computers excel at certain problems where classical computers struggle, such as:
- Factoring large numbers (RSA encryption)
- Drug molecule simulation
- Optimization problems
- Machine learning at scale

We're still in the **NISQ** (Noisy Intermediate-Scale Quantum) era, meaning today's quantum computers have limited qubits and significant error rates. But progress is accelerating rapidly!`
  },
  {
    keywords: ['python', 'function', 'code', 'sort', 'programming'],
    response: `Here's a clean Python function to sort a list using the built-in sort, plus a custom implementation for learning:

### Using built-in sort:
\`\`\`python
def sort_list(items, reverse=False):
    \"\"\"Sort a list in ascending order by default.\"\"\"
    return sorted(items, reverse=reverse)

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_nums = sort_list(numbers)
print(f"Original: {numbers}")
print(f"Sorted:   {sorted_nums}")
\`\`\`

### Custom quicksort implementation:
\`\`\`python
def quicksort(arr):
    \"\"\"In-place quicksort algorithm.\"\"\"
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quicksort(left) + middle + quicksort(right)

# Example
data = [3, 6, 8, 10, 1, 2, 1]
print(quicksort(data))  # [1, 1, 2, 3, 6, 8, 10]
\`\`\`

Python's built-in \`sorted()\` uses **Timsort** — a hybrid sorting algorithm derived from merge sort and insertion sort — which is highly efficient with O(n log n) complexity.`
  },
  {
    keywords: ['api', 'rest', 'design', 'endpoint'],
    response: `Great question! Here are the key best practices for designing REST APIs:

## 1. Use Consistent Naming Conventions
- Use **nouns** for resources: \`/users\`, \`/orders\`
- Use **plural names**: \`/api/products\` not \`/api/product\`
- Use **kebab-case** for multi-word: \`/order-items\`

## 2. Leverage HTTP Methods Correctly
\`\`\`
GET    /users        # List users
POST   /users        # Create user
GET    /users/:id    # Get user by ID
PUT    /users/:id    # Update user (full)
PATCH  /users/:id    # Partial update
DELETE /users/:id    # Delete user
\`\`\`

## 3. Use Proper Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK — successful GET, PUT, PATCH |
| 201 | Created — successful POST |
| 204 | No Content — successful DELETE |
| 400 | Bad Request — invalid input |
| 401 | Unauthorized — missing auth |
| 404 | Not Found — resource doesn't exist |
| 429 | Too Many Requests — rate limited |
| 500 | Internal Server Error |

## 4. Version Your API
\`\`\`
GET /api/v1/users
GET /api/v2/users
\`\`\`

## 5. Paginate Collections
\`\`\`json
GET /api/users?page=2&limit=20
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}
\`\`\`

Would you like me to dive deeper into any of these topics? Authentication patterns maybe?`
  },
  {
    keywords: ['travel', 'trip', 'paris', 'vacation', 'weekend'],
    response: `Here's a **2-day weekend itinerary for Paris** that balances iconic sights with local charm!

## Day 1: Iconic Paris 🇫🇷

**Morning (9am - 12pm)**
- ☕ Start with a café au lait at a local *boulangerie*
- 🗼 Visit the **Eiffel Tower** — book tickets in advance!
- 🌳 Stroll through the **Champ de Mars** gardens

**Afternoon (12pm - 5pm)**
- 🥐 Lunch in **Le Marais** district — try a classic croque monsieur
- 🎨 Explore the **Louvre Museum** (book timed entry)
- 🚶 Walk along the **Seine River**

**Evening (7pm onwards)**
- 🍷 Dinner in **Montmartre** near Sacré-Cœur
- 🌆 Evening view of Paris from the Sacré-Cœur steps

## Day 2: Culture & Charm

**Morning**
- 🏛️ **Musée d'Orsay** for Impressionist art
- 🛍️ Browse **Rue des Martyrs** market street

**Afternoon**
- 🥐 Macaron tasting at **Ladurée**
- 🎭 **Notre-Dame Cathedral** exterior + Île de la Cité

**Evening**
- 🚢 **Seine river cruise** at sunset — magical!
- 🥂 Final dinner near **Place de la Concorde**

### Pro Tips:
- Get the **Navigo Découverte** pass for unlimited metro travel
- Pre-book museums (they sell out!)
- Learn a few phrases: *Bonjour, Merci, S'il vous plaît*`
  },
  {
    keywords: ['default', 'hello', 'hi', 'hey', 'help', ''],
    response: `Hello! 👋 I'm Gemma, your AI assistant. I'm here to help with:

- 💻 **Coding** — writing, debugging, explaining code
- 📚 **Learning** — breaking down complex topics
- ✍️ **Writing** — drafting emails, articles, creative content
- 🤔 **Brainstorming** — ideas, solutions, strategies
- 📊 **Analysis** — data interpretation, pros and cons

What would you like help with today?`
  },
  {
    keywords: ['javascript', 'js', 'react', 'frontend', 'web'],
    response: `JavaScript is incredibly versatile! Here's a quick overview of modern JS concepts:

### Modern JavaScript Features

**Arrow Functions:**
\`\`\`javascript
// Traditional
function add(a, b) { return a + b; }

// Arrow function
const add = (a, b) => a + b;

// With single parameter (no parens needed)
const double = x => x * 2;
\`\`\`

**Destructuring:**
\`\`\`javascript
// Object destructuring
const user = { name: 'Alice', age: 30, city: 'NYC' };
const { name, age } = user;

// Array destructuring
const colors = ['red', 'green', 'blue'];
const [first, ...rest] = colors;
\`\`\`

**Async/Await:**
\`\`\`javascript
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/$\{userId}\`);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};
\`\`\`

**Optional Chaining & Nullish Coalescing:**
\`\`\`javascript
const city = user?.address?.city ?? 'Unknown';
\`\`\`

Want me to dive deeper into any of these topics?`
  },
  {
    keywords: ['css', 'design', 'styling', 'layout', 'responsive'],
    response: `CSS has evolved tremendously! Here are some modern CSS techniques:

### CSS Grid Layout
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}
\`\`\`

### Flexbox Centering
\`\`\`css
.centered {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
\`\`\`

### Custom Properties (Variables)
\`\`\`css
:root {
  --primary: #7c6ff7;
  --surface: #1a1a2e;
  --radius: 12px;
}

.card {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent);
}
\`\`\`

### Container Queries
\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
\`\`\`

### Modern Reset
\`\`\`css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}
\`\`\`

CSS is incredibly powerful these days — you can create full layouts without a single media query!`
  },
  {
    keywords: ['database', 'sql', 'mongodb', 'data', 'storage'],
    response: `Let me break down the key differences between SQL and NoSQL databases:

## SQL Databases (e.g., PostgreSQL, MySQL)
- **Structured** data with predefined schemas
- **Relationships** between tables via foreign keys
- **ACID** compliant (Atomicity, Consistency, Isolation, Durability)
- Great for: financial systems, ERP, complex queries

\`\`\`sql
SELECT users.name, orders.total
FROM users
JOIN orders ON users.id = orders.user_id
WHERE users.created_at > '2024-01-01'
GROUP BY users.id
HAVING COUNT(orders.id) > 5;
\`\`\`

## NoSQL Databases (e.g., MongoDB)
- **Flexible** schemas (document-based)
- **Horizontal scaling** built-in
- Great for: real-time apps, IoT, content management

\`\`\`javascript
// MongoDB document
{
  _id: ObjectId("..."),
  name: "Alice",
  orders: [
    { total: 45.99, items: 3 },
    { total: 120.00, items: 5 }
  ]
}
\`\`\`

### When to Choose What:
- **Use SQL** when data integrity and relationships matter most
- **Use NoSQL** when you need flexibility and scalability at speed
- **Many modern apps** use both — a **polyglot persistence** approach

What's your use case? I can give more specific recommendations!`
  },
  {
    keywords: ['explain', 'what is', 'meaning', 'define'],
    response: `I'd be happy to explain! Could you be a bit more specific about what you'd like me to explain?

In the meantime, here are some topics I can help with:

- 🔬 **Science & Technology** — AI, quantum computing, cybersecurity
- 💻 **Programming** — any language, framework, or concept
- 📐 **Mathematics** — from algebra to calculus and statistics
- 🌍 **General Knowledge** — history, economics, philosophy
- 🎨 **Creative** — writing tips, design principles, music theory

Just ask away and I'll give you a clear, thorough explanation with examples!`
  },
  {
    keywords: ['thanks', 'thank you', 'great', 'awesome', 'cool', 'nice'],
    response: `You're very welcome! 😊 I'm glad I could help!

Feel free to ask if you have any follow-up questions or need anything else. I'm here whenever you need me!

What would you like to explore next?`
  }
];

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
// Find Best Mock Response
// ============================================

function findResponse(userMessage) {
  const lower = userMessage.toLowerCase();

  // Check for keyword matches
  for (const entry of MOCK_RESPONSES) {
    for (const keyword of entry.keywords) {
      if (keyword && lower.includes(keyword)) {
        return entry.response;
      }
    }
  }

  // Return a general fallback response
  const fallbacks = [
    `That's an interesting question! Let me share my thoughts on this.

Here are a few perspectives to consider:

1. **From a technical standpoint** — this really depends on your specific context and requirements. The key is to understand the trade-offs involved.

2. **A practical approach** — I'd recommend starting with a minimal viable solution and iterating based on feedback. You'll learn more from real-world usage than from planning alone.

3. **Looking ahead** — keep an eye on emerging trends in this space. The landscape is evolving rapidly, and staying flexible is important.

Would you like me to explore any particular aspect of this in more depth? I'm happy to dive deeper into whatever interests you most!`,

    `Great question! Let me help you think through this.

**Here's my take:**

The most effective approach depends on your specific goals and constraints. There are several angles to consider:

- 🎯 **What are you trying to achieve?** The "best" solution is the one that aligns with your objectives
- 🔧 **What tools do you have available?** Sometimes the optimal choice is what your team already knows well
- 📈 **How will this scale?** Think about future growth, not just immediate needs

**My recommendation:** Start with something simple that works, then refine based on real feedback. Perfect is the enemy of good!

Let me know if you'd like me to elaborate on any specific aspect.`,
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
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
// Streaming Typing Effect
// ============================================

async function streamResponse(messageElement, fullText) {
  const bubble = messageElement.querySelector('.message-bubble');
  let displayed = '';
  const chars = fullText.split('');
  let index = 0;

  // Show cursor
  bubble.innerHTML = '<span class="typing-cursor"></span>';

  return new Promise((resolve) => {
    function typeNext() {
      if (index >= chars.length) {
        // Done — render full markdown and remove cursor
        bubble.innerHTML = renderMarkdown(fullText);
        resolve();
        return;
      }

      // Add next chunk
      const chunkSize = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < chunkSize && index < chars.length; i++) {
        displayed += chars[index];
        index++;
      }

      // Show as plain text with cursor
      const displayText = escapeHtml(displayed);
      bubble.innerHTML = `<p>${displayText}</p><span class="typing-cursor"></span>`;

      // Scroll as text appears
      scrollToBottom();

      // Dynamic delay — slower for punctuation, faster for regular chars
      const char = chars[index - 1] || '';
      let delay = 15 + Math.random() * 20; // 15-35ms base

      if (char === '.' || char === '!' || char === '?') {
        delay = 200;
      } else if (char === ',' || char === ';' || char === ':') {
        delay = 100;
      } else if (char === '\n') {
        delay = 80;
      }

      setTimeout(typeNext, delay);
    }

    typeNext();
  });
}

// ============================================
// Send Message
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

  // Add user message
  addMessageToDOM('user', message);
  state.messages.push({ role: 'user', content: message });

  // Clear input & disable
  dom.chatInput.value = '';
  dom.sendBtn.disabled = true;
  dom.chatInput.style.height = 'auto';
  state.isTyping = true;

  // Show typing indicator
  dom.typingIndicator.classList.remove('hidden');
  scrollToBottom();

  // Simulate "thinking" delay
  const thinkingTime = 500 + Math.random() * 1000;
  await new Promise((r) => setTimeout(r, thinkingTime));

  // Hide typing indicator
  dom.typingIndicator.classList.add('hidden');

  // Get response
  const responseText = findResponse(message);

  // Add assistant message with streaming
  const msgElement = addMessageToDOM('assistant', '', true);
  await streamResponse(msgElement, responseText);

  // Add suggested follow-ups
  addFollowups(msgElement);

  state.messages.push({ role: 'assistant', content: responseText });
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
  console.log(`Model switched to: ${selected}`);
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

console.log('%c\u2666 Gemma Chat %c v1.0', 'color: #7c6ff7; font-weight: bold; font-size: 14px;', 'color: #a0a0c0; font-size: 12px;');
console.log('%cBuilt with \u2661 by you', 'color: #6a6a8a; font-size: 11px;');
