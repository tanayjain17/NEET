import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export type VegetarianOptimizationRequest = {
  cyclePhase: string
  currentDay: number
  energyLevel: number
  studyHours: number
  symptoms: string[]
  preferences: {
    spiceLevel: 'mild' | 'medium' | 'spicy'
    mealTiming: string[]
    allergies: string[]
  }
}

export async function generateVegetarianOptimization(data: VegetarianOptimizationRequest): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert in vegetarian nutrition and Ayurvedic medicine specializing in optimizing cognitive performance for NEET preparation during menstrual cycles. 

IMPORTANT CONSTRAINTS:
- Patient is VEGETARIAN (no meat, fish, eggs)
- Patient DOES NOT consume tea or coffee (suggest herbal alternatives only)
- Focus on Indian vegetarian foods and Ayurvedic herbs
- All recommendations must be scientifically backed
- Prioritize foods that enhance memory, focus, and energy for medical exam preparation

Provide practical, actionable advice in a caring, supportive tone.`
        },
        {
          role: 'user',
          content: `Please provide personalized vegetarian hormonal optimization for NEET preparation:

Current Status:
- Menstrual Phase: ${data.cyclePhase}
- Cycle Day: ${data.currentDay}
- Energy Level: ${data.energyLevel}/10
- Daily Study Hours: ${data.studyHours}
- Current Symptoms: ${data.symptoms.join(', ') || 'None reported'}
- Spice Preference: ${data.preferences.spiceLevel}
- Meal Timing: ${data.preferences.mealTiming.join(', ')}
- Allergies: ${data.preferences.allergies.join(', ') || 'None'}

Please provide:
1. Specific vegetarian foods for cognitive enhancement during this cycle phase
2. Ayurvedic herbs and natural supplements (no tea/coffee)
3. Meal timing optimization for study performance
4. Natural energy boosters without caffeine
5. Stress management techniques suitable for Indian students
6. Specific nutrients to focus on during this phase

Keep recommendations practical for a busy NEET student and her family to implement.`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1000
    })

    return completion.choices[0]?.message?.content || 'Unable to generate recommendations at this time.'
  } catch (error) {
    console.error('GROQ API error:', error)
    return 'Unable to generate personalized recommendations. Please try again later.'
  }
}

export async function generateEmergencyVegetarianSupport(data: {
  issue: string
  severity: 'mild' | 'moderate' | 'severe'
  cyclePhase: string
  availableTime: number
}): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an emergency support specialist for vegetarian NEET students experiencing menstrual-related study disruptions. 

CONSTRAINTS:
- VEGETARIAN solutions only
- NO tea/coffee recommendations
- Focus on immediate, practical solutions
- Must help student continue studying
- Use Indian home remedies and Ayurvedic principles

Provide quick, actionable solutions that can be implemented immediately.`
        },
        {
          role: 'user',
          content: `EMERGENCY SUPPORT NEEDED:

Issue: ${data.issue}
Severity: ${data.severity}
Cycle Phase: ${data.cyclePhase}
Available Time: ${data.availableTime} minutes

Provide immediate vegetarian solutions to help continue NEET preparation:
1. Quick relief protocol (${data.availableTime} min or less)
2. Vegetarian foods/drinks for immediate help
3. Ayurvedic remedies using common household items
4. Study modification techniques
5. When to seek additional help

Focus on solutions that work within ${data.availableTime} minutes and help maintain study momentum.`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.8,
      max_tokens: 800
    })

    return completion.choices[0]?.message?.content || 'Unable to generate emergency support at this time.'
  } catch (error) {
    console.error('GROQ API error:', error)
    return 'Unable to generate emergency support. Please consult a healthcare provider if symptoms persist.'
  }
}

export async function generateVegetarianStudyTechniques(data: {
  cyclePhase: string
  subject: string
  energyLevel: number
  focusLevel: number
  studyDuration: number
}): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a NEET preparation expert specializing in cycle-optimized study techniques for vegetarian students.

Focus on:
- Ayurvedic principles for cognitive enhancement
- Vegetarian brain foods to consume before/during study
- Natural (non-caffeine) alertness techniques
- Study methods optimized for different menstrual phases
- Memory techniques enhanced by vegetarian nutrition`
        },
        {
          role: 'user',
          content: `Optimize ${data.subject} study technique for vegetarian NEET student:

Current State:
- Cycle Phase: ${data.cyclePhase}
- Energy Level: ${data.energyLevel}/10
- Focus Level: ${data.focusLevel}/10
- Study Duration: ${data.studyDuration} minutes

Provide:
1. Best vegetarian pre-study snacks for this phase
2. Study technique optimized for current energy/focus levels
3. Natural alertness boosters (no caffeine)
4. Break activities that enhance retention
5. Post-study nutrition for memory consolidation

Make it specific to ${data.subject} and current cycle phase.`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 700
    })

    return completion.choices[0]?.message?.content || 'Unable to generate study techniques at this time.'
  } catch (error) {
    console.error('GROQ API error:', error)
    return 'Unable to generate personalized study techniques. Please try again later.'
  }
}