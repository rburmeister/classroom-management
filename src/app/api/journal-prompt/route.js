import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to get user input
    const { userInput } = await req.json();
    
    // Use the user's input or a default value if the input is empty
    const operation = userInput || "summer";
    
    // Create a prompt based on the requested operation or user input
    const prompt = `The journal prompt should be about ${operation}`;

    const promptData = {
      model: 'gpt-4',
      messages: [
        {
          role: "system",
          content: "Create a 5th-grade appropriate journal prompt. Make it engaging and at the appropriate level for a 5th grader. It should be concise and no longer than 2 or 3 sentences."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    };

    // Call the OpenAI API using a fetch request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use your OpenAI API key here
      },
      body: JSON.stringify(promptData),
    });

    const data = await response.json();
    const journalPrompt = data.choices[0].message.content.trim();

    // Return the generated journal prompt as JSON
    return NextResponse.json({ prompt: journalPrompt });
  } catch (error) {
    console.error('Error generating journal prompt:', error);
    return NextResponse.json({ error: 'Failed to generate journal prompt' }, { status: 500 });
  }
}