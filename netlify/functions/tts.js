exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let text
  try {
    text = JSON.parse(event.body).text
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid body' }) }
  }

  if (!text) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No text provided' }) }
  }

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: text.slice(0, 4500) },
          voice: { languageCode: 'en-US', name: 'en-US-Neural2-F' },
          audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95 },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Google TTS error:', err)
      return { statusCode: 502, body: JSON.stringify({ error: 'TTS API error', detail: err }) }
    }

    const data = await response.json()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioContent: data.audioContent }),
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to synthesize speech' }) }
  }
}
