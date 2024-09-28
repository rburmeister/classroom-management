import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Get the 'operation' from the query params. Default to 'multiplication'.
    const operation = req.nextUrl.searchParams.get('operation') || "multiplication";

    console.log('Operation:', operation);

    // Create the prompt based on the operation.
    const prompt = `Create a math problem for a 4th-grade student that involves ${operation}. Make it engaging and suitable for their grade level.`;

    const promptData = {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Create a 4th-grade appropriate math problem. Keep it engaging and simple.' },
        { role: 'user', content: prompt }
      ]
    };

    // Fetch the response from OpenAI's API.
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure your OpenAI API key is set correctly
      },
      body: JSON.stringify(promptData),
    });

    // Handle the response from OpenAI API
    const data = await response.json();

    // Safely access the response data
    if (data?.choices && data.choices[0]?.message?.content) {
      const mathProblem = data.choices[0].message.content.trim();
      console.log('Generated Math Problem:', mathProblem);

      // Return the generated math problem as JSON
      return NextResponse.json({ mathProblem });
    } else {
      console.error('Unexpected response format:', data);
      return NextResponse.json({ error: 'Unexpected response format from OpenAI' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error generating math problem:', error);
    return NextResponse.json({ error: 'Failed to generate math problem' }, { status: 500 });
  }
}
