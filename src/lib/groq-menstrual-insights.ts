import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export type MenstrualInsightRequest = {
  currentPhase: string
  cycleDay: number
  energyLevel: number
  focusLevel: number
  memoryRetention: number
  cycleHealth: string
  pregnancyChance: string
  studyHours: number
  testScores: number[]
  dailyQuestions: number
}

export async function generateMenstrualInsights(data: MenstrualInsightRequest): Promise<string> {
  try {
    const prompt = `
You are an AI expert in menstrual cycle optimization for NEET preparation. Analyze the following data and provide personalized insights:

Current Status:
- Menstrual Phase: ${data.currentPhase}
- Cycle Day: ${data.cycleDay}
- Energy Level: ${data.energyLevel}/10
- Focus Level: ${data.focusLevel}/10
- Memory Retention: ${data.memoryRetention}/10
- Cycle Health: ${data.cycleHealth}
- Pregnancy Chance: ${data.pregnancyChance}

NEET Preparation Data:
- Daily Study Hours: ${data.studyHours}
- Recent Test Scores: ${data.testScores.join(', ')}
- Daily Questions Solved: ${data.dailyQuestions}

Provide a comprehensive analysis covering:
1. How the current menstrual phase is affecting NEET preparation
2. Specific study strategies for this phase
3. Energy optimization recommendations
4. Subject-wise focus suggestions (Physics, Chemistry, Biology)
5. Test-taking strategies during this phase
6. Health and wellness tips for better performance
7. Timeline predictions for optimal study periods

Keep the response under 300 words, practical, and encouraging for achieving AIR under 50.
`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a specialized AI assistant for NEET preparation optimization based on menstrual cycle analysis. Provide scientific, practical, and encouraging advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 400,
    })

    return completion.choices[0]?.message?.content || 'Unable to generate insights at this time.'
  } catch (error) {
    console.error('GROQ API error:', error)
    return 'AI insights temporarily unavailable. Please check your cycle data and try again.'
  }
}