const SYSTEM_PROMPT = `You are a curator of remarkable places. Given a list of nearby places with their Wikipedia descriptions, rank them from most to least interesting for a curious walker.

Prioritize: ghost towns, unusual history, quirky landmarks, hidden gems, architectural oddities, strange place names with stories behind them, cultural significance, natural wonders.

Deprioritize: generic townships, plain suburbs, unremarkable cities named after other cities.

Return ONLY a JSON array of place names in ranked order, most interesting first. Use the exact names as given. Include every place. Example:
["Wonderland", "Old Mill Cemetery", "Lockville Canal Park", "Jefferson Township"]`

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let places
  try {
    places = JSON.parse(event.body).places
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  if (!places || !places.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No places provided' }) }
  }

  const placesText = places
    .map((p, i) => `${i + 1}. ${p.name}\n${p.description?.slice(0, 300) ?? ''}`)
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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [
          {
            role: 'user',
            content: `Rank these places by curiosity and interest:\n\n${placesText}`,
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

    let ranked
    try {
      ranked = JSON.parse(rawText)
    } catch (e) {
      console.error('Failed to parse rank response:', rawText)
      return { statusCode: 502, body: JSON.stringify({ error: 'Invalid response format' }) }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ranked }),
    }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to rank places' }) }
  }
}
