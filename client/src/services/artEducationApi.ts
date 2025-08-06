import localforage from 'localforage';

// Art education interfaces inspired by Art for Kids Hub curriculum
export interface ArtLesson {
  id: string;
  title: string;
  category: 'drawing' | 'painting' | 'sketching' | 'mixed-media';
  grade: 3 | 4 | 5 | 6;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // minutes
  materials: string[];
  steps: ArtStep[];
  objectives: string[];
  techniques: string[];
  inspirationSource: string; // Art for Kids Hub video reference
  standards: string[]; // National Visual Arts Standards
  createdAt: string;
  thumbnailUrl?: string;
}

export interface ArtStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
  imageUrl?: string;
  videoTimestamp?: string; // For Art for Kids Hub video reference
}

export interface DrawingProject {
  id: string;
  title: string;
  lessonId: string;
  canvasData: string; // Base64 encoded canvas data
  createdAt: string;
  lastModified: string;
  grade: number;
  isCompleted: boolean;
  timeSpent: number;
  tags: string[];
}

export interface ArtProgress {
  lessonId: string;
  stepsCompleted: number;
  totalSteps: number;
  timeSpent: number;
  skillsLearned: string[];
  completedAt?: string;
}

// Storage configuration
const artStorage = localforage.createInstance({
  name: 'ArtEducation',
  version: 1.0,
  storeName: 'lessons',
  description: 'Art education content and drawing projects'
});

const projectStorage = localforage.createInstance({
  name: 'ArtProjects',
  version: 1.0,
  storeName: 'drawings',
  description: 'User drawing projects and artwork'
});

// Art for Kids Hub inspired content
class ArtEducationService {
  
  async getDrawingLessons(grade: number): Promise<ArtLesson[]> {
    const cacheKey = `art_drawing_grade_${grade}`;
    
    try {
      const cached = await artStorage.getItem<ArtLesson[]>(cacheKey);
      if (cached) return cached;
      
      // Art for Kids Hub inspired lessons adapted for educational standards
      const lessons: ArtLesson[] = [
        {
          id: `art_hub_drawing_${grade}_1`,
          title: 'Draw a Cute Cartoon Cat',
          category: 'drawing',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Learn to draw an adorable cartoon cat using simple shapes and lines. Perfect for beginners!',
          difficulty: 'easy',
          duration: 30,
          materials: ['Paper', 'Pencil', 'Eraser', 'Colored pencils (optional)'],
          objectives: [
            'Practice drawing basic shapes (circles, ovals, triangles)',
            'Learn to combine shapes to create characters',
            'Develop hand-eye coordination and fine motor skills',
            'Express creativity through character design'
          ],
          techniques: ['Shape construction', 'Line drawing', 'Basic proportions'],
          inspirationSource: 'Art for Kids Hub - How to Draw a Cat',
          standards: ['VA:Cr1.1.Ka', 'VA:Cr2.1.2a', 'VA:Re7.1.Ka'],
          steps: [
            {
              id: 'cat_step_1',
              stepNumber: 1,
              title: 'Draw the Head',
              instruction: 'Start with a big circle for the cat\'s head. Make it nice and round!',
              tip: 'Don\'t worry if your circle isn\'t perfect - cats come in all shapes!',
              imageUrl: '/art-steps/cat-head.png'
            },
            {
              id: 'cat_step_2',
              stepNumber: 2,
              title: 'Add the Ears',
              instruction: 'Draw two triangles on top of the circle for ears. Make them pointy like a real cat!',
              tip: 'Space the ears apart so they look balanced on the head.',
              imageUrl: '/art-steps/cat-ears.png'
            },
            {
              id: 'cat_step_3',
              stepNumber: 3,
              title: 'Draw the Face',
              instruction: 'Add two dots for eyes, a small triangle for the nose, and a curved line for the mouth.',
              tip: 'Make the eyes big and cute! Cartoon animals look friendlier with big eyes.',
              imageUrl: '/art-steps/cat-face.png'
            },
            {
              id: 'cat_step_4',
              stepNumber: 4,
              title: 'Add the Body',
              instruction: 'Draw an oval below the head for the body. Make it a bit bigger than the head.',
              tip: 'Leave a small gap between the head and body - we\'ll connect them later!',
              imageUrl: '/art-steps/cat-body.png'
            },
            {
              id: 'cat_step_5',
              stepNumber: 5,
              title: 'Draw the Legs',
              instruction: 'Add four small ovals for legs underneath the body.',
              tip: 'Make the front legs a little different from the back legs for a more natural look.',
              imageUrl: '/art-steps/cat-legs.png'
            },
            {
              id: 'cat_step_6',
              stepNumber: 6,
              title: 'Add the Tail',
              instruction: 'Draw a long, curved line for the tail. Make it swish to one side!',
              tip: 'Cat tails can be curvy, straight, or even curled up - be creative!',
              imageUrl: '/art-steps/cat-tail.png'
            },
            {
              id: 'cat_step_7',
              stepNumber: 7,
              title: 'Final Details',
              instruction: 'Add whiskers, stripes, or spots. Color your cat however you like!',
              tip: 'Every cat is unique - make yours special with your own creative touches!',
              imageUrl: '/art-steps/cat-complete.png'
            }
          ],
          createdAt: new Date().toISOString(),
          thumbnailUrl: '/art-thumbnails/cute-cat.png'
        },
        {
          id: `art_hub_drawing_${grade}_2`,
          title: 'Simple Landscape with Trees and Mountains',
          category: 'drawing',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Create a beautiful landscape drawing with trees, mountains, and sky using basic shapes and shading.',
          difficulty: 'medium',
          duration: 45,
          materials: ['Paper', 'Pencil', 'Eraser', 'Colored pencils or crayons'],
          objectives: [
            'Understand foreground, middle ground, and background',
            'Practice creating depth in drawings',
            'Learn basic landscape composition',
            'Develop observation skills of nature'
          ],
          techniques: ['Layering', 'Basic perspective', 'Shading', 'Composition'],
          inspirationSource: 'Art for Kids Hub - How to Draw a Landscape',
          standards: ['VA:Cr1.2.3a', 'VA:Cr2.2.3a', 'VA:Re7.2.3a'],
          steps: [
            {
              id: 'landscape_step_1',
              stepNumber: 1,
              title: 'Draw the Horizon Line',
              instruction: 'Draw a straight line across your paper about 1/3 from the bottom. This separates sky from land.',
              tip: 'Use a ruler if you want a perfectly straight line, but freehand is fine too!',
              imageUrl: '/art-steps/horizon-line.png'
            },
            {
              id: 'landscape_step_2',
              stepNumber: 2,
              title: 'Add Mountains',
              instruction: 'Draw triangle shapes above the horizon line for mountains. Make some tall, some short.',
              tip: 'Overlap the mountains to create depth - closer mountains should be in front!',
              imageUrl: '/art-steps/mountains.png'
            },
            {
              id: 'landscape_step_3',
              stepNumber: 3,
              title: 'Draw Trees',
              instruction: 'Add trees of different sizes. Use triangles for pine trees, circles for leafy trees.',
              tip: 'Make trees in front bigger and trees far away smaller - this creates perspective!',
              imageUrl: '/art-steps/trees.png'
            },
            {
              id: 'landscape_step_4',
              stepNumber: 4,
              title: 'Add Ground Details',
              instruction: 'Draw grass, rocks, or flowers on the ground. Add a path or stream if you like!',
              tip: 'Small details make your landscape more interesting and realistic.',
              imageUrl: '/art-steps/ground-details.png'
            },
            {
              id: 'landscape_step_5',
              stepNumber: 5,
              title: 'Create the Sky',
              instruction: 'Add clouds, sun, or birds in the sky. Make the sky interesting but not too busy.',
              tip: 'Clouds can be simple oval shapes. Don\'t forget to show where the light is coming from!',
              imageUrl: '/art-steps/sky-details.png'
            },
            {
              id: 'landscape_step_6',
              stepNumber: 6,
              title: 'Add Colors and Shading',
              instruction: 'Color your landscape! Use lighter colors for far away things, darker for close things.',
              tip: 'Think about what time of day it is - sunrise, noon, or sunset? This affects your colors!',
              imageUrl: '/art-steps/landscape-complete.png'
            }
          ],
          createdAt: new Date().toISOString(),
          thumbnailUrl: '/art-thumbnails/landscape.png'
        }
      ];
      
      if (grade >= 4) {
        lessons.push({
          id: `art_hub_drawing_${grade}_3`,
          title: 'Portrait Drawing - Self Portrait',
          category: 'drawing',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Learn to draw faces and create a self-portrait using proportions and observation skills.',
          difficulty: 'medium',
          duration: 50,
          materials: ['Paper', 'Pencil', 'Eraser', 'Mirror', 'Colored pencils'],
          objectives: [
            'Learn basic face proportions',
            'Develop observation skills',
            'Practice drawing facial features',
            'Create a personal artwork (self-portrait)'
          ],
          techniques: ['Proportional drawing', 'Observation', 'Shading', 'Detail work'],
          inspirationSource: 'Art for Kids Hub - How to Draw a Face',
          standards: ['VA:Cr1.2.4a', 'VA:Cr2.3.4a', 'VA:Re7.1.4a'],
          steps: [
            {
              id: 'portrait_step_1',
              stepNumber: 1,
              title: 'Draw the Face Shape',
              instruction: 'Start with an oval shape for the head. Look in a mirror - is your face more round or oval?',
              tip: 'Everyone\'s face shape is different - draw what you see, not what you think a face should look like!',
              imageUrl: '/art-steps/face-shape.png'
            },
            {
              id: 'portrait_step_2',
              stepNumber: 2,
              title: 'Add Guidelines',
              instruction: 'Draw a line down the middle and across the middle of your oval. This helps place features.',
              tip: 'These lines are just helpers - you can erase them later!',
              imageUrl: '/art-steps/face-guidelines.png'
            },
            {
              id: 'portrait_step_3',
              stepNumber: 3,
              title: 'Draw the Eyes',
              instruction: 'Eyes go on the horizontal line. Look at your eyes in the mirror - what shape are they?',
              tip: 'The space between eyes is about one eye-width. Don\'t make eyes too high or too low!',
              imageUrl: '/art-steps/eyes.png'
            },
            {
              id: 'portrait_step_4',
              stepNumber: 4,
              title: 'Add the Nose',
              instruction: 'The nose sits on the vertical line, between the eyes and bottom of the face.',
              tip: 'Noses can be tricky! Start simple with just the nostrils and tip.',
              imageUrl: '/art-steps/nose.png'
            },
            {
              id: 'portrait_step_5',
              stepNumber: 5,
              title: 'Draw the Mouth',
              instruction: 'The mouth goes about halfway between the nose and chin. Look at your mouth shape!',
              tip: 'Lips have different shapes - some are full, some are thin. Draw YOUR lips!',
              imageUrl: '/art-steps/mouth.png'
            },
            {
              id: 'portrait_step_6',
              stepNumber: 6,
              title: 'Add Hair and Details',
              instruction: 'Draw your hairstyle, ears, eyebrows, and any special features that make you YOU!',
              tip: 'This is where your portrait becomes unique - add what makes you special!',
              imageUrl: '/art-steps/portrait-complete.png'
            }
          ],
          createdAt: new Date().toISOString(),
          thumbnailUrl: '/art-thumbnails/self-portrait.png'
        });
      }
      
      if (grade >= 5) {
        lessons.push({
          id: `art_hub_drawing_${grade}_4`,
          title: 'Still Life Drawing - Fruit Bowl',
          category: 'drawing',
          grade: grade as 3 | 4 | 5 | 6,
          description: 'Learn to draw from observation with a classic still life setup featuring fruits and simple objects.',
          difficulty: 'hard',
          duration: 60,
          materials: ['Paper', 'Pencil', 'Eraser', 'Blending stump', 'Real fruits for reference'],
          objectives: [
            'Develop observational drawing skills',
            'Learn about light and shadow',
            'Practice drawing different textures',
            'Understand composition in still life'
          ],
          techniques: ['Observation', 'Shading', 'Texture', 'Composition', 'Value studies'],
          inspirationSource: 'Art for Kids Hub - How to Draw Still Life',
          standards: ['VA:Cr1.2.5a', 'VA:Cr2.3.5a', 'VA:Re7.2.5a', 'VA:Cn10.1.5a'],
          steps: [
            {
              id: 'still_life_step_1',
              stepNumber: 1,
              title: 'Set Up Your Still Life',
              instruction: 'Arrange 3-4 fruits in a bowl. Add good lighting from one side.',
              tip: 'Simple arrangements work best. Try apples, oranges, or bananas - they have clear shapes!',
              imageUrl: '/art-steps/still-life-setup.png'
            },
            {
              id: 'still_life_step_2',
              stepNumber: 2,
              title: 'Sketch Basic Shapes',
              instruction: 'Look at each fruit and draw its basic shape first. Don\'t worry about details yet!',
              tip: 'Squint your eyes to see the big shapes better. Ignore small details for now.',
              imageUrl: '/art-steps/basic-shapes.png'
            },
            {
              id: 'still_life_step_3',
              stepNumber: 3,
              title: 'Add the Bowl',
              instruction: 'Draw the bowl\'s outline. Remember, it\'s an oval shape from your viewing angle.',
              tip: 'The bowl might look like a flattened circle because of perspective.',
              imageUrl: '/art-steps/bowl-outline.png'
            },
            {
              id: 'still_life_step_4',
              stepNumber: 4,
              title: 'Refine the Shapes',
              instruction: 'Make your fruit shapes more accurate. Look carefully at each one.',
              tip: 'Every apple is different! Draw what you see, not what you think an apple looks like.',
              imageUrl: '/art-steps/refined-shapes.png'
            },
            {
              id: 'still_life_step_5',
              stepNumber: 5,
              title: 'Add Light and Shadow',
              instruction: 'Look for the lightest and darkest areas on each fruit. Start adding shading.',
              tip: 'Squint to see values better. Where is the light coming from? Where are the shadows?',
              imageUrl: '/art-steps/light-shadow.png'
            },
            {
              id: 'still_life_step_6',
              stepNumber: 6,
              title: 'Final Details and Textures',
              instruction: 'Add the special textures - smooth apple skin, bumpy orange peel, etc.',
              tip: 'Don\'t try to draw every tiny detail. Suggest textures with your pencil marks.',
              imageUrl: '/art-steps/still-life-complete.png'
            }
          ],
          createdAt: new Date().toISOString(),
          thumbnailUrl: '/art-thumbnails/still-life.png'
        });
      }
      
      await artStorage.setItem(cacheKey, lessons);
      return lessons;
      
    } catch (error) {
      console.error('Error loading art lessons:', error);
      return [];
    }
  }
  
  async saveDrawingProject(project: DrawingProject): Promise<void> {
    try {
      await projectStorage.setItem(project.id, project);
      
      // Also save to projects list
      const projectsList = await this.getUserProjects() || [];
      const existingIndex = projectsList.findIndex(p => p.id === project.id);
      
      if (existingIndex >= 0) {
        projectsList[existingIndex] = project;
      } else {
        projectsList.push(project);
      }
      
      await projectStorage.setItem('user_projects_list', projectsList);
    } catch (error) {
      console.error('Error saving drawing project:', error);
    }
  }
  
  async getUserProjects(): Promise<DrawingProject[]> {
    try {
      return await projectStorage.getItem('user_projects_list') || [];
    } catch (error) {
      console.error('Error getting user projects:', error);
      return [];
    }
  }
  
  async getProjectById(id: string): Promise<DrawingProject | null> {
    try {
      return await projectStorage.getItem(id);
    } catch (error) {
      console.error('Error getting project by ID:', error);
      return null;
    }
  }
  
  async deleteProject(id: string): Promise<void> {
    try {
      await projectStorage.removeItem(id);
      
      // Remove from projects list
      const projectsList = await this.getUserProjects() || [];
      const updatedList = projectsList.filter(p => p.id !== id);
      await projectStorage.setItem('user_projects_list', updatedList);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }
  
  async saveArtProgress(progress: ArtProgress): Promise<void> {
    try {
      const progressKey = `art_progress_${progress.lessonId}`;
      await artStorage.setItem(progressKey, progress);
    } catch (error) {
      console.error('Error saving art progress:', error);
    }
  }
  
  async getArtProgress(lessonId: string): Promise<ArtProgress | null> {
    try {
      return await artStorage.getItem(`art_progress_${lessonId}`);
    } catch (error) {
      console.error('Error getting art progress:', error);
      return null;
    }
  }
}

export const artEducationService = new ArtEducationService();