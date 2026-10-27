// src/data/personas.js - User Persona Definitions for Testing & Nudge Verification

export const PERSONAS = {
  student: {
    id: 'student',
    name: 'Ananya',
    age: 20,
    role: 'University Student',
    avatar: 'A',
    badge: 'Student Persona',
    description: 'Uses ChatGPT between lectures for revision and flashcard testing.',
    voiceNeed: 'Hands-free querying when multitasking with study notes.',
    suggestedQuery: 'Can you summarize the primary differences between active transport and passive transport in biology with three bullet points?',
    fifteenWordSample: 'I am preparing for my final biology examination tomorrow and need a quick summary of cellular respiration steps.',
    simulatedVoiceScript: 'Explain the difference between mitosis and meiosis in simple bullet points for my exam revision.'
  },
  professional: {
    id: 'professional',
    name: 'Rohan',
    age: 34,
    role: 'Product Consultant',
    avatar: 'R',
    badge: 'Professional Persona',
    description: 'Drafts project briefs, analysis queries, and team sync agendas.',
    voiceNeed: 'Quickly dictating long thoughts while commuting or between meetings.',
    suggestedQuery: 'Draft a concise executive update for leadership detailing our sprint progress and key delivery risks.',
    fifteenWordSample: 'Please review our quarterly project roadmap and highlight the key engineering dependencies before our sync meeting this afternoon.',
    simulatedVoiceScript: 'Draft a polite follow-up email to the engineering team summarizing our sprint goals and key deadlines.'
  },
  voice_pro: {
    id: 'voice_pro',
    name: 'Priya',
    age: 29,
    role: 'Creative Marketer',
    avatar: 'P',
    badge: 'Brainstormer Persona',
    description: 'Relies on voice for ambient ideation and creative tagline drafting.',
    voiceNeed: 'Instant, reliable voice activation without tedious navigation.',
    suggestedQuery: 'Brainstorm 5 innovative marketing concepts for a new productivity application launching next quarter.',
    fifteenWordSample: 'We need creative campaign angles for our upcoming autumn product launch that emphasize speed, simplicity, and delight.',
    simulatedVoiceScript: 'Brainstorm five catchy tagline ideas for a modern AI voice productivity app.'
  }
};
