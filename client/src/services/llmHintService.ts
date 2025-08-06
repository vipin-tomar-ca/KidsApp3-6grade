// import * as tf from '@tensorflow/tfjs';
// import * as use from '@tensorflow-models/universal-sentence-encoder';
import localforage from 'localforage';

export interface HintRequest {
  userId: string;
  subject: 'math' | 'english' | 'music' | 'art' | 'science';
  grade: number;
  context: string;
  userInput: string;
  activityType: 'problem-solving' | 'creative-writing' | 'music-composition' | 'drawing' | 'science-experiment';
}

export interface HintResponse {
  hint: string;
  confidence: number;
  category: 'encourage' | 'guide' | 'explain' | 'suggest';
  isFiltered: boolean;
  timestamp: string;
}

export interface HintInteraction {
  id: string;
  userId: string;
  request: HintRequest;
  response: HintResponse;
  timestamp: string;
  helpful?: boolean; // User feedback
}

// Educational topic whitelist for safety filtering
const EDUCATIONAL_TOPICS = [
  // Math topics
  'addition', 'subtraction', 'multiplication', 'division', 'fractions', 'decimals', 
  'geometry', 'shapes', 'patterns', 'counting', 'measurement', 'time', 'money',
  'word problems', 'equations', 'graphs', 'probability', 'statistics',
  
  // English/Language Arts
  'reading', 'writing', 'grammar', 'spelling', 'vocabulary', 'stories', 'poems',
  'characters', 'plot', 'setting', 'sentences', 'paragraphs', 'punctuation',
  'adjectives', 'verbs', 'nouns', 'creative writing', 'journal', 'essay',
  
  // Science
  'animals', 'plants', 'weather', 'seasons', 'water cycle', 'rocks', 'minerals',
  'magnets', 'electricity', 'light', 'sound', 'matter', 'energy', 'ecosystems',
  'human body', 'space', 'planets', 'stars', 'experiments', 'observations',
  
  // Music
  'rhythm', 'melody', 'beat', 'tempo', 'notes', 'scales', 'instruments',
  'songs', 'composition', 'patterns', 'listening', 'pitch', 'volume',
  
  // Art
  'drawing', 'painting', 'colors', 'shapes', 'lines', 'texture', 'patterns',
  'portraits', 'landscapes', 'creativity', 'imagination', 'design'
];

// Pre-defined hint templates for different subjects and scenarios
const HINT_TEMPLATES = {
  math: {
    'stuck-on-problem': [
      "Try breaking this problem into smaller steps. What's the first thing you need to find?",
      "Can you draw a picture or diagram to help you see the problem better?",
      "What math operation do you think might help here? Addition, subtraction, multiplication, or division?",
      "Look for key words in the problem that might give you clues about what to do."
    ],
    'fraction-help': [
      "Try thinking of fractions like pizza slices! If you have 1/2, that's half a pizza.",
      "Can you draw circles and divide them into equal parts to see the fractions?",
      "Remember: the bottom number tells you how many equal parts, the top tells you how many you have."
    ],
    'word-problems': [
      "Read the problem slowly and underline the important numbers and words.",
      "What is the problem asking you to find? Circle that part!",
      "Try writing the problem in your own words - what's really happening?"
    ],
    'geometry': [
      "Count the sides and corners of the shape. What patterns do you notice?",
      "Can you find this shape around your house or classroom?",
      "Try tracing the shape with your finger to feel how it's made."
    ]
  },
  english: {
    'creative-writing': [
      "Start by thinking about your favorite place or person. What makes them special?",
      "Try using your five senses! What do you see, hear, smell, feel, and taste?",
      "Ask yourself: Who is in your story? Where are they? What happens to them?",
      "Don't worry about perfect spelling right now - just get your ideas down!"
    ],
    'reading-comprehension': [
      "After reading each paragraph, try to tell someone what happened in your own words.",
      "Look for clues in the pictures - they often help explain the story!",
      "If you don't understand a word, try reading the sentences around it for hints.",
      "Think about how the characters feel. How do you know they feel that way?"
    ],
    'grammar': [
      "Read your sentence out loud. Does it sound right to your ears?",
      "Remember: every sentence needs a person or thing (noun) and an action (verb).",
      "Try clapping for each word to make sure they're in the right order."
    ]
  },
  music: {
    'rhythm-patterns': [
      "Try clapping along with the beat first. Can you feel the steady pulse?",
      "Count '1, 2, 3, 4' and clap on each number to start.",
      "Listen to your heartbeat - that's a natural rhythm you already know!",
      "Try making patterns like 'clap, clap, rest, clap' and repeat it."
    ],
    'melody-creation': [
      "Start with just three notes and make a simple pattern that goes up and down.",
      "Try humming a tune you know and then change just one or two notes.",
      "Think about how melodies can sound happy (going up) or sad (going down)."
    ],
    'instrument-learning': [
      "Practice makes progress! Even 5 minutes a day helps your fingers remember.",
      "Start slowly and gradually get faster as you feel more comfortable.",
      "Listen to how professional musicians play this piece for inspiration."
    ]
  },
  science: {
    'experiments': [
      "Before you start, make a prediction: What do you think will happen and why?",
      "Write down what you observe with all your senses (but don't taste unless it's safe!).",
      "If the result is different than expected, that's exciting! Science is about discovering new things."
    ],
    'observations': [
      "Look closely and describe what you see using specific words and details.",
      "Compare what you're observing to something familiar. What's similar or different?",
      "Try looking at the same thing from different angles or distances."
    ]
  },
  art: {
    'drawing': [
      "Start with basic shapes like circles, squares, and triangles - you can build almost anything!",
      "Don't worry about making it perfect. Art is about expressing your ideas and feelings.",
      "Look at the object you're drawing and notice its colors, textures, and proportions.",
      "Try different pencil pressures - light for sketching, darker for final lines."
    ],
    'color-theory': [
      "Primary colors (red, blue, yellow) can mix to make all other colors!",
      "Warm colors (reds, oranges, yellows) can make things feel cozy and energetic.",
      "Cool colors (blues, greens, purples) can make things feel calm and peaceful."
    ]
  }
};

class LLMHintService {
  private model: any = null;
  private isModelLoaded = false;
  private interactionHistory: HintInteraction[] = [];

  constructor() {
    this.initializeStorage();
    this.loadModel();
  }

  private async initializeStorage() {
    await localforage.config({
      name: 'LLMHintService',
      version: 1.0,
      size: 4980736,
      storeName: 'hint_interactions',
      description: 'LLM hint interactions for parental review'
    });

    // Load existing interactions
    try {
      const stored = await localforage.getItem<HintInteraction[]>('interactions');
      if (stored) {
        this.interactionHistory = stored;
      }
    } catch (error) {
      console.error('Error loading hint interactions:', error);
    }
  }

  private async loadModel() {
    try {
      console.log('Loading Universal Sentence Encoder for hint generation...');
      // Note: For production use, uncomment the TensorFlow.js imports and this line:
      // this.model = await use.load();
      
      // For now, using template-based system which is more reliable for educational content
      this.isModelLoaded = false;
      console.log('Using template-based hint system for reliable educational content');
    } catch (error) {
      console.error('Error loading LLM model:', error);
      // Fallback to template-based hints if model fails to load
      this.isModelLoaded = false;
    }
  }

  private isEducationalContent(text: string): boolean {
    const lowercaseText = text.toLowerCase();
    
    // Check if the text contains educational keywords
    const hasEducationalTopic = EDUCATIONAL_TOPICS.some(topic => 
      lowercaseText.includes(topic.toLowerCase())
    );
    
    // Check for inappropriate content patterns
    const inappropriatePatterns = [
      'violence', 'weapon', 'hurt', 'hate', 'mean', 'stupid', 'dumb',
      'personal information', 'address', 'phone', 'email'
    ];
    
    const hasInappropriateContent = inappropriatePatterns.some(pattern =>
      lowercaseText.includes(pattern)
    );
    
    return hasEducationalTopic && !hasInappropriateContent;
  }

  private selectTemplateHint(request: HintRequest): string {
    const { subject, context, userInput } = request;
    const subjectTemplates = HINT_TEMPLATES[subject] as any;
    
    if (!subjectTemplates) {
      return "That's a great question! Try thinking about it step by step and don't be afraid to ask your teacher for help.";
    }

    // Simple keyword matching to select appropriate hint category
    const contextLower = context.toLowerCase();
    const userInputLower = userInput.toLowerCase();
    
    // Math-specific hint selection
    if (subject === 'math') {
      if (contextLower.includes('fraction') || userInputLower.includes('fraction')) {
        const hints = subjectTemplates['fraction-help'] || subjectTemplates['stuck-on-problem'];
        return hints[Math.floor(Math.random() * hints.length)];
      }
      if (contextLower.includes('word problem') || contextLower.includes('story')) {
        const hints = subjectTemplates['word-problems'] || subjectTemplates['stuck-on-problem'];
        return hints[Math.floor(Math.random() * hints.length)];
      }
      if (contextLower.includes('shape') || contextLower.includes('geometry')) {
        const hints = subjectTemplates['geometry'] || subjectTemplates['stuck-on-problem'];
        return hints[Math.floor(Math.random() * hints.length)];
      }
    }

    // English-specific hint selection
    if (subject === 'english') {
      if (contextLower.includes('story') || contextLower.includes('creative')) {
        const hints = subjectTemplates['creative-writing'];
        return hints[Math.floor(Math.random() * hints.length)];
      }
      if (contextLower.includes('reading') || contextLower.includes('comprehension')) {
        const hints = subjectTemplates['reading-comprehension'];
        return hints[Math.floor(Math.random() * hints.length)];
      }
      if (contextLower.includes('grammar') || contextLower.includes('sentence')) {
        const hints = subjectTemplates['grammar'];
        return hints[Math.floor(Math.random() * hints.length)];
      }
    }

    // Fallback to general hints for the subject
    const allHints = Object.values(subjectTemplates).flat();
    return allHints[Math.floor(Math.random() * allHints.length)];
  }

  private async generateAdvancedHint(request: HintRequest): Promise<string> {
    if (!this.isModelLoaded || !this.model) {
      return this.selectTemplateHint(request);
    }

    try {
      // Use the model for more sophisticated hint generation
      const prompt = `Subject: ${request.subject}, Grade: ${request.grade}, Context: ${request.context}, Student input: ${request.userInput}`;
      
      // For now, we'll still use template-based approach as it's more reliable for educational content
      // Advanced LLM integration would require a more sophisticated setup
      return this.selectTemplateHint(request);
    } catch (error) {
      console.error('Error generating advanced hint:', error);
      return this.selectTemplateHint(request);
    }
  }

  async generateHint(request: HintRequest): Promise<HintResponse> {
    // Safety filter - ensure content is educational
    const isFiltered = !this.isEducationalContent(request.context + ' ' + request.userInput);
    
    if (isFiltered) {
      return {
        hint: "I can only help with schoolwork and learning activities. Try asking about math, reading, science, music, or art!",
        confidence: 1.0,
        category: 'guide',
        isFiltered: true,
        timestamp: new Date().toISOString()
      };
    }

    // Generate appropriate hint
    const hint = await this.generateAdvancedHint(request);
    
    // Determine hint category based on content
    let category: HintResponse['category'] = 'guide';
    if (hint.includes('Try') || hint.includes('Can you')) category = 'suggest';
    if (hint.includes('great') || hint.includes('good')) category = 'encourage';
    if (hint.includes('Remember') || hint.includes('means')) category = 'explain';

    const response: HintResponse = {
      hint,
      confidence: 0.8,
      category,
      isFiltered: false,
      timestamp: new Date().toISOString()
    };

    // Log interaction for parental review
    await this.logInteraction(request, response);

    return response;
  }

  private async logInteraction(request: HintRequest, response: HintResponse) {
    const interaction: HintInteraction = {
      id: `hint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: request.userId,
      request,
      response,
      timestamp: new Date().toISOString()
    };

    this.interactionHistory.push(interaction);
    
    // Keep only last 100 interactions to manage storage
    if (this.interactionHistory.length > 100) {
      this.interactionHistory = this.interactionHistory.slice(-100);
    }

    try {
      await localforage.setItem('interactions', this.interactionHistory);
    } catch (error) {
      console.error('Error saving hint interaction:', error);
    }
  }

  async getInteractionHistory(userId?: string): Promise<HintInteraction[]> {
    if (userId) {
      return this.interactionHistory.filter(interaction => interaction.userId === userId);
    }
    return this.interactionHistory;
  }

  async markHintHelpful(interactionId: string, helpful: boolean) {
    const interaction = this.interactionHistory.find(i => i.id === interactionId);
    if (interaction) {
      interaction.helpful = helpful;
      try {
        await localforage.setItem('interactions', this.interactionHistory);
      } catch (error) {
        console.error('Error updating hint feedback:', error);
      }
    }
  }

  getModelStatus(): { isLoaded: boolean; error?: string } {
    return {
      isLoaded: this.isModelLoaded,
      error: this.isModelLoaded ? undefined : 'Model not loaded - using template-based hints'
    };
  }
}

export const llmHintService = new LLMHintService();