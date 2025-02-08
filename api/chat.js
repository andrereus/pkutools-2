export const config = {
  runtime: 'edge'
}

const SYSTEM_PROMPT = `Du bist ein Ernährungsberater, spezialisiert auf PKU (Phenylketonurie). 
Beantworte Fragen präzise und berücksichtige dabei die Phe-Toleranz des Patienten.
Beachte folgende Regeln:
- Gib Phe-Werte immer in Milligramm (mg) an
- Berücksichtige die übrige Phe-Toleranz bei Empfehlungen
- Bei Unsicherheit über genaue Phe-Werte, gib dies an
- Sei vorsichtig mit Empfehlungen und weise auf die Notwendigkeit der Rücksprache mit dem behandelnden Arzt hin`

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  }

  try {
    const { messages, pheTolerance, pheTotal, pheRemaining } = await req.json()

    const contextMessage = `Aktuelle Werte des Patienten:
- Phe-Toleranz: ${pheTolerance}mg pro Tag
- Bereits aufgenommenes Phe: ${pheTotal}mg
- Verbleibendes Phe: ${pheRemaining}mg`

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: contextMessage },
      ...messages
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        temperature: 0.7,
        stream: true
      })
    })

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}
