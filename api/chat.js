// api/chat.js - Vercel Serverless Function (100% Free, Zero-Dependency AI Response Streamer)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { prompt = '', persona = 'student', inputMethod = 'text' } = req.body || {};

    // Enable Server-Sent Events (SSE) streaming headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    const isVoice = inputMethod === 'voice';
    
    // Dynamic contextual responses tailored to the active persona
    let responseText = '';
    if (persona === 'student') {
      responseText = isVoice
        ? `I received your spoken question: "${prompt}"\n\nHere is a quick study breakdown:\n\n1. **Core Concept:** When reviewing complex material, voice input lets you capture thoughts 3x faster than typing.\n2. **Active Recall:** You can verbally test your memory hands-free without looking down at a keyboard.\n3. **Clarity & Structure:** Your notes are automatically organized with key takeaways for quick revision.\n\nWould you like me to generate a practice quiz or summarize this further?`
        : `Thanks for your question: "${prompt}"\n\nHere is a structured explanation:\n\n- **Key Takeaway:** Breaking down topics into modular flashcards significantly boosts retention.\n- **Tip:** Next time you have a lengthy study question, try using voice input to speak it out aloud!`;
    } else if (persona === 'professional') {
      responseText = isVoice
        ? `Captured your voice prompt: "${prompt}"\n\nHere is an executive action summary:\n\n- **Efficiency Gain:** Dictating this prompt saved approximately 45 seconds of typing.\n- **Draft Outline:**\n  1. Review strategic goals with the core team.\n  2. Align on project milestones and deliverables.\n  3. Circulate action items before end-of-day.\n- **Next Step:** You can edit, copy, or request a full memo format.`
        : `Received your project brief: "${prompt}"\n\nHere is a professional summary:\n\n- **Project Focus:** Strategic milestone execution and team alignment.\n- **Recommendation:** Keep weekly syncs concise and track action items asynchronously.\n\nLet me know if you would like this expanded into a formal presentation outline!`;
    } else {
      responseText = isVoice
        ? `Great ideas captured via voice: "${prompt}"\n\nHere are 3 creative brainstorm directions:\n\n1. **Idea One:** Focus on seamless user convenience with zero-tap activation.\n2. **Idea Two:** Highlight ambient intelligence that adapts dynamically to typing length.\n3. **Idea Three:** Leverage micro-interactions that educate users without feeling intrusive.\n\nWhich direction would you like to explore deeper?`
        : `Here are several brainstorm concepts for: "${prompt}"\n\n- Rapid prototyping allows for early usability testing and user feedback.\n- Combining voice dictation with text provides the ultimate flexibility.`;
    }

    const words = responseText.split(' ');
    for (let i = 0; i < words.length; i++) {
      const token = words[i] + (i === words.length - 1 ? '' : ' ');
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
      // Realistic typing cadence (35ms per word)
      await new Promise(resolve => setTimeout(resolve, 35));
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
