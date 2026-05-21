/* ============================================
   Gemma Chat — Backend Server
   Proxies requests to Ollama's local API
   ============================================ */

'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const OLLAMA_BASE = 'http://localhost:11434';

// ─── Middleware ───────────────────────────────

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// ─── API: Chat ───────────────────────────────

app.post('/api/chat', async (req, res) => {
  const { messages, model } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const modelName = model || 'gemma4:latest';

  // Set streaming headers — we send SSE-like events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const ollamaRes = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelName,
        messages,
        stream: true,
      }),
    });

    if (!ollamaRes.ok) {
      let errorMsg;
      if (ollamaRes.status === 404) {
        errorMsg = `Model "${modelName}" not found. Run: ollama pull ${modelName}`;
      } else {
        const text = await ollamaRes.text().catch(() => 'Unknown error');
        errorMsg = `Ollama error (${ollamaRes.status}): ${text}`;
      }
      res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
      res.end();
      return;
    }

    const reader = ollamaRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const parsed = JSON.parse(trimmed);

          if (parsed.message?.content) {
            res.write(`data: ${JSON.stringify({ content: parsed.message.content })}\n\n`);
          }

          if (parsed.done) {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          }
        } catch {
          // Skip malformed lines
        }
      }
    }

    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// ─── API: Status ─────────────────────────────

app.get('/api/status', async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE}/api/tags`);
    const data = await response.json();
    const models = (data.models || []).map((m) => m.name);

    res.json({
      available: true,
      models,
      hasGemma: models.some((m) => m.startsWith('gemma')),
    });
  } catch {
    res.json({ available: false, models: [], hasGemma: false });
  }
});

// ─── Start ───────────────────────────────────

app.listen(PORT, () => {
  console.log('');
  console.log('  \u2666 Gemma Chat Server');
  console.log('  \u2500'.repeat(28));
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log('');
});
