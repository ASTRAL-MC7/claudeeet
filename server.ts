import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini API route for open-ended cinema vibe matchmaking
app.post('/api/vibe-recommend', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a high-taste repertory cinema sommelier and curator for CineVibe.
The user will describe an emotional frequency, sensory ambiance, aesthetic, or movie desires.
Analyze their mood with sophisticated, poetic film analysis.
Available catalog IDs to recommend (pick 2 to 3 from this list if applicable):
- blade-runner-2049
- past-lives
- zodiac
- everything-everywhere-all-at-once
- mad-max-fury-road
- the-grand-budapest-hotel
- the-lighthouse
- before-sunrise
- drive
- spirited-away
- knives-out
- her
- whiplash
- aftersun
- severance-s1
- parasite
- the-nice-guys
- arrival
- cure
- the-banshees-of-inisherin
- dune-part-two
- portrait-of-a-lady-on-fire

Format your output strictly matching the requested JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser request: "${prompt}"` }] }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vibeAnalysis: {
              type: Type.STRING,
              description: 'Poetic, evocative breakdown of the user mood frequency'
            },
            recommendedMovieIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of matching movie IDs from the provided list'
            },
            customPicks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  year: { type: Type.INTEGER },
                  director: { type: Type.STRING },
                  whyItFits: { type: Type.STRING },
                  ambientTip: { type: Type.STRING }
                },
                required: ['title', 'year', 'director', 'whyItFits', 'ambientTip']
              }
            },
            pairedSnackOrDrink: {
              type: Type.STRING,
              description: 'Artisan beverage or snack tailored to the sensory mood'
            },
            ambianceSetting: {
              type: Type.STRING,
              description: 'Lighting, audio level, or room preparation tip'
            }
          },
          required: ['vibeAnalysis', 'recommendedMovieIds', 'customPicks', 'pairedSnackOrDrink', 'ambianceSetting']
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from model');
    }

    const parsed = JSON.parse(responseText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating vibe recommendation:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CineVibe server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
