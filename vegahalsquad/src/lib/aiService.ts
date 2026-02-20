/**
 * AI Service for CampuSync
 * 
 * INTEGRATION GUIDE:
 * 1. API Keys: You can configure API keys in the dashboard's "AI Settings" tab.
 * 2. Models: Currently supports OpenAI (GPT-4o mini) and Grok (grok-beta).
 * 3. Endpoints: Uses official OpenAI and xAI completions endpoints.
 */

export type AIProvider = 'openai' | 'grok';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export const getAIResponse = async (
    messages: ChatMessage[],
    apiKey: string,
    provider: AIProvider = 'openai'
) => {
    const baseUrl = provider === 'openai'
        ? 'https://api.openai.com/v1/chat/completions'
        : 'https://api.x.ai/v1/chat/completions'; // Grok API endpoint

    const model = provider === 'openai' ? 'gpt-4o-mini' : 'grok-beta';

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch from AI API');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error: any) {
        console.error('AI Service Error:', error);
        throw error;
    }
};

export const generateSystemPrompt = (role: string, contextData: any) => {
    return `You are CampuSync AI, an intelligent assistant for a campus super app. 
  Your current role is assisting a ${role}. 
  
  CONTEXT DATA:
  ${JSON.stringify(contextData, null, 2)}
  
  Instructions:
  - Be helpful, concise, and professional.
  - Use the provided context data to answer questions accurately.
  - If a user asks about events, check the "events" list.
  - If a faculty asks about assignments, check the "assignments" list.
  - If a student asks about their grades, check "examResults" or relevant data.
  - If you don't know something from the context, say so and provide general campus guidance.
  - Current time: ${new Date().toLocaleString()}`;
};
