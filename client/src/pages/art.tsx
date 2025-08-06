import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { Palette, ArrowLeft, Play, Trophy, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import DigitalArtCanvas from '@/components/DigitalArtCanvas';

interface ArtPageState {
  selectedGrade: number;
}

const ArtPage: React.FC = () => {
  const [location, navigate] = useLocation();
  const [currentView, setCurrentView] = useState<'menu' | 'canvas'>('menu');
  const [selectedLesson, setSelectedLesson] = useState<string | undefined>(undefined);
  
  // Get grade from navigation state (would normally come from props or context)
  const selectedGrade = 4; // Default for now

  // Comprehensive Visual Arts Curriculum based on CBSE, ICSE & IB standards
  const artSkillAreas = [
    {
      title: "Drawing & Sketching",
      icon: "✏️",
      color: "from-blue-400 to-blue-600",
      lessons: [
        {
          id: 1,
          title: "Basic Lines & Shapes",
          description: "Master fundamental drawing techniques with lines, circles, and shapes",
          grade: "3-4",
          duration: "20 min",
          difficulty: 1,
          points: 15,
          completed: true,
          curriculum: "CBSE/ICSE",
          skills: ["Line drawing", "Shape formation", "Hand coordination"],
          materials: ["Pencil", "Paper", "Eraser"]
        },
        {
          id: 2,
          title: "Still Life Drawing",
          description: "Draw objects from observation to develop observational skills",
          grade: "4-5",
          duration: "30 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP/CBSE",
          skills: ["Observation", "Proportion", "Shading techniques"],
          materials: ["Drawing pencils", "Paper", "Objects to draw"]
        },
        {
          id: 3,
          title: "Perspective Drawing",
          description: "Learn basic perspective to create depth in drawings",
          grade: "5-6",
          duration: "35 min",
          difficulty: 3,
          points: 25,
          completed: false,
          curriculum: "ICSE/IB PYP",
          skills: ["Perspective", "Depth", "Spatial understanding"],
          materials: ["Pencils", "Ruler", "Paper"]
        }
      ]
    },
    {
      title: "Color & Painting",
      icon: "🎨",
      color: "from-red-400 to-red-600",
      lessons: [
        {
          id: 4,
          title: "Color Wheel Explorer",
          description: "Discover primary, secondary colors and color mixing",
          grade: "3-4",
          duration: "25 min",
          difficulty: 1,
          points: 15,
          completed: true,
          curriculum: "CBSE/ICSE",
          skills: ["Color theory", "Color mixing", "Primary/secondary colors"],
          materials: ["Watercolors", "Brushes", "Paper", "Water"]
        },
        {
          id: 5,
          title: "Landscape Painting",
          description: "Paint natural scenes using different techniques and colors",
          grade: "4-5",
          duration: "40 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP/CBSE",
          skills: ["Landscape composition", "Brush techniques", "Color application"],
          materials: ["Poster colors", "Brushes", "Canvas/paper"]
        },
        {
          id: 6,
          title: "Abstract Art Creation",
          description: "Express emotions and ideas through abstract painting",
          grade: "5-6",
          duration: "35 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP/ICSE",
          skills: ["Abstract expression", "Color harmony", "Creative thinking"],
          materials: ["Acrylic paints", "Canvas", "Various brushes"]
        }
      ]
    },
    {
      title: "Craft & 3D Art",
      icon: "🏺",
      color: "from-green-400 to-green-600",
      lessons: [
        {
          id: 7,
          title: "Clay Modeling",
          description: "Create 3D sculptures using clay and modeling techniques",
          grade: "3-4",
          duration: "30 min",
          difficulty: 1,
          points: 15,
          completed: false,
          curriculum: "CBSE/ICSE",
          skills: ["3D modeling", "Sculpting", "Fine motor skills"],
          materials: ["Clay", "Modeling tools", "Water"]
        },
        {
          id: 8,
          title: "Collage & Mixed Media",
          description: "Combine different materials to create textured artwork",
          grade: "4-6",
          duration: "35 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP/CBSE",
          skills: ["Mixed media", "Texture creation", "Material exploration"],
          materials: ["Paper", "Fabric", "Natural materials", "Glue"]
        }
      ]
    },
    {
      title: "Cultural Arts",
      icon: "🌍",
      color: "from-purple-400 to-purple-600",
      lessons: [
        {
          id: 9,
          title: "Folk Art Patterns",
          description: "Explore traditional art forms like Rangoli, Mandala, and Alpana",
          grade: "3-5",
          duration: "25 min",
          difficulty: 1,
          points: 15,
          completed: false,
          curriculum: "CBSE/ICSE",
          skills: ["Cultural awareness", "Pattern making", "Traditional techniques"],
          materials: ["Colored powders", "Chalk", "Paper"]
        },
        {
          id: 10,
          title: "World Art Exploration",
          description: "Study and create art inspired by different cultures",
          grade: "5-6",
          duration: "30 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP",
          skills: ["Cultural appreciation", "Art history", "Global perspective"],
          materials: ["Various art supplies", "Reference images"]
        }
      ]
    }
  ];

  if (currentView === 'canvas') {
    return (
      <div>
        <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1000 }}>
          <Button
            variant="light"
            className="rounded-circle"
            onClick={() => setCurrentView('menu')}
          >
            <ArrowLeft size={20} />
          </Button>
        </div>
        <DigitalArtCanvas 
          grade={selectedGrade}
          lessonId={selectedLesson}
          onProjectSave={(project) => {
            console.log('Project saved:', project);
            // You could show a success message or update UI here
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Navigation Header */}
      <NavigationHeader 
        title="Art Studio"
        progress={60}
      />

      <div className="max-w-md mx-auto px-4">
        {/* Welcome Message */}
        <Card className="rounded-3xl shadow-lg mb-6 bg-gradient-to-r from-purple-50 to-pink-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Art Studio!
              </h2>
              <p className="text-gray-600">
                Create amazing artwork and learn drawing skills for Grade {selectedGrade}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="rounded-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Palette className="mr-2 text-kid-purple" size={20} />
              Your Art Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-purple-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-purple">8</div>
                <div className="text-sm text-gray-600">Artworks</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-blue">160</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-yellow-600">4</div>
                <div className="text-sm text-gray-600">Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Art Skill Areas - Comprehensive Curriculum */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Visual Arts Curriculum (Grades 3-6)</h3>
          <div className="space-y-6">
            {artSkillAreas.map((area, areaIndex) => (
              <div key={areaIndex} className="space-y-4">
                {/* Skill Area Header */}
                <Card className={cn("rounded-3xl shadow-lg bg-gradient-to-r", area.color)}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="text-4xl">{area.icon}</div>
                      <div>
                        <h2 className="text-xl font-bold mb-1">{area.title}</h2>
                        <p className="text-white/90 text-sm">
                          {area.lessons.length} lessons • CBSE/ICSE/IB curriculum
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lessons in this skill area */}
                <div className="space-y-3 ml-4">
                  {area.lessons.map((lesson) => (
                    <Card 
                      key={lesson.id} 
                      className={cn(
                        "rounded-2xl shadow-md transition-all duration-300 hover:scale-102 cursor-pointer",
                        lesson.completed 
                          ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200" 
                          : "bg-white hover:shadow-lg"
                      )}
                      onClick={() => {
                        setCurrentView('canvas');
                        setSelectedLesson(`art_lesson_${lesson.id}`);
                      }}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">
                                {lesson.title}
                              </h3>
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                lesson.difficulty === 1 ? "bg-green-100 text-green-700" :
                                lesson.difficulty === 2 ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              )}>
                                Grade {lesson.grade}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3">
                              {lesson.description}
                            </p>
                            
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center space-x-1">
                                <Trophy className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  {lesson.points} pts
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  {lesson.duration}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {lesson.curriculum}
                                </span>
                              </div>
                            </div>

                            {/* Skills Tags */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {lesson.skills.map((skill, skillIndex) => (
                                <span 
                                  key={skillIndex}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            {/* Materials */}
                            {lesson.materials && (
                              <div className="text-xs text-gray-500">
                                <span className="font-semibold">Materials:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {lesson.materials.map((material, materialIndex) => (
                                    <span key={materialIndex} className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                      {material}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {lesson.completed ? (
                              <div className="bg-green-500 text-white rounded-full p-2">
                                <Trophy className="h-5 w-5" />
                              </div>
                            ) : (
                              <div className="bg-purple-500 text-white rounded-full p-2 hover:bg-purple-600 transition-colors">
                                <Play className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Art Tools */}
        <Card className="rounded-3xl shadow-lg mb-8 bg-gradient-to-r from-pink-500 to-purple-500">
          <CardContent className="pt-6 text-center">
            <div className="text-white">
              <div className="text-4xl mb-4">🖌️</div>
              <h3 className="text-xl font-bold mb-2">Quick Create</h3>
              <p className="text-pink-100 mb-4">
                Jump into free drawing mode!
              </p>
              <button 
                className="bg-white text-purple-600 font-bold py-2 px-6 rounded-xl kid-button text-sm"
                onClick={() => {
                  setCurrentView('canvas');
                  setSelectedLesson(undefined);
                }}
              >
                Start Drawing ✏️
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ArtPage;