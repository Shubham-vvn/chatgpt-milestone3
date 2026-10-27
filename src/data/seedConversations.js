// src/data/seedConversations.js - Initial Seed Chat Messages for Each Persona

export const SEED_CONVERSATIONS = {
  student: [
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Hi ChatGPT, can you help me prepare for my upcoming genetics test?',
      inputMethod: 'text',
      timestamp: '10:14 AM'
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      text: 'Certainly, Ananya! We can review Mendelian inheritance, DNA replication, or gene expression.\n\nWhich topic would you like to start with today?',
      inputMethod: 'text',
      timestamp: '10:14 AM'
    }
  ],
  professional: [
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Hey ChatGPT, I need to synthesize our quarterly project metrics for stakeholders.',
      inputMethod: 'text',
      timestamp: '09:30 AM'
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      text: 'I can help outline your update, Rohan. Send over your key metrics (velocity, release dates, blockers), and I will structure them into an executive summary.',
      inputMethod: 'text',
      timestamp: '09:30 AM'
    }
  ],
  voice_pro: [
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Let\'s brainstorm some positioning angles for our new voice discovery tool.',
      inputMethod: 'voice',
      timestamp: '11:05 AM'
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      text: 'Great idea, Priya! Voice tools thrive when positioned around friction removal—giving users their hands and time back.\n\nLet\'s explore taglines centered on "Think it, Speak it, Done."',
      inputMethod: 'text',
      timestamp: '11:05 AM'
    }
  ]
};
