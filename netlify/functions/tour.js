const SYSTEM_PROMPT = `You are an enthusiastic, knowledgeable walking tour guide. Given a list of nearby places with Wikipedia descriptions, create a structured walking tour with exactly 3 stops (or 4 if there are 4+ strong options).

Return ONLY a valid JSON object — no markdown fences, no explanation:
{
  "stops": [
    {
      "name": "Exact place name from the provided list",
      "highlight": "One compelling sentence capturing the most interesting thing about this place.",
      "before": "2–3 sentences setting the scene or transitioning from the previous stop. Use **double asterisks** around 1–2 key phrases worth emphasizing."
    }
  ],
  "closing": "1–2 warm sentences wrapping up the tour. Use **double asterisks** around 1–2 key phrases."
}

The "before" for the first stop should introduce the tour and excite the walker. For later stops, transition naturally from the previous location. Only use facts from the provided descriptions.`

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let places, startIndex
  try {
    const body = JSON.parse(event.body)
    places = body.places
    startIndex = body.startIndex ?? 0
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  const tourPlaces = places.slice(startIndex, startIndex + 6)

  if (!tourPlaces || !tourPlaces.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No places provided' }) }
  }

  const placesText = tourPlaces
    .map((p, i) => {
      const dist = p.distance ? ` (${p.distance} miles away)` : ''
      const description = p.description?.slice(0, 400) ?? ''
      return `${i + 1}. ${p.name}${dist}\n${description}`
    })
    .join('\n\n')

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          {
            role: 'user',
            content: `Here are the nearby places for this walking tour:\n\n${placesText}\n\nCreate the walking tour JSON.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', err)
      return { statusCode: 502, body: JSON.stringify({ error: 'Upstream API error', detail: err }) }
    }

    const data = await response.json()
    const rawText = data.content[0].text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

    let parsed
    try {
      parsed = JSON.parse(rawText)
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', rawText)
      return { statusCode: 502, body: JSON.stringify({ error: 'Invalid response format from AI' }) }
    }

    const enrichedStops = parsed.stops.map((stop) => {
      const place =
        tourPlaces.find((p) => p.name.toLowerCase() === stop.name.toLowerCase()) ||
        tourPlaces.find((p) => p.name.toLowerCase().includes(stop.name.toLowerCase())) ||
        {}
      return {
        name: stop.name,
        highlight: stop.highlight,
        before: stop.before,
        imgUrl: place.imgUrl || null,
        wikiUrl: place.wikiUrl || null,
        distance: place.distance || null,
        mapUrl: place.mapUrl || null,
      }
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stops: enrichedStops, closing: parsed.closing }),
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to generate tour' }) }
  }
}
