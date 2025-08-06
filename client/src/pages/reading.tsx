import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { BookOpen, ArrowLeft, Play, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Reading() {
  const navigate = useNavigate();
  
  const handleBackToSubjects = () => {
    navigate('/subjects');
  };
  
  // Comprehensive Reading & Language Arts Curriculum based on ICSE, CBSE & IB standards
  const readingSkillAreas = [
    {
      title: "Reading Comprehension",
      icon: "📖",
      color: "from-blue-400 to-blue-600",
      lessons: [
        {
          id: 1,
          title: "Main Idea Detective",
          description: "Find the main idea and supporting details in stories",
          grade: "3-4",
          duration: "20 min",
          difficulty: 1,
          points: 15,
          completed: true,
          curriculum: "ICSE/CBSE",
          skills: ["Main idea identification", "Supporting details", "Text analysis"]
        },
        {
          id: 2,
          title: "Inference Explorer",
          description: "Read between the lines and make logical inferences",
          grade: "4-5",
          duration: "25 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP/CBSE",
          skills: ["Making inferences", "Context clues", "Critical thinking"]
        },
        {
          id: 3,
          title: "Compare & Contrast Stories",
          description: "Analyze similarities and differences across multiple texts",
          grade: "5-6",
          duration: "30 min",
          difficulty: 3,
          points: 25,
          completed: false,
          curriculum: "ICSE/IB PYP",
          skills: ["Text comparison", "Literary analysis", "Critical evaluation"]
        }
      ]
    },
    {
      title: "Vocabulary Building",
      icon: "📝",
      color: "from-green-400 to-green-600",
      lessons: [
        {
          id: 4,
          title: "Word Family Adventures",
          description: "Explore word families and root words",
          grade: "3-4",
          duration: "15 min",
          difficulty: 1,
          points: 10,
          completed: true,
          curriculum: "CBSE/ICSE",
          skills: ["Word families", "Root words", "Word patterns"]
        },
        {
          id: 5,
          title: "Context Clue Champion",
          description: "Use context to determine word meanings",
          grade: "4-5",
          duration: "20 min",
          difficulty: 2,
          points: 15,
          completed: false,
          curriculum: "IB PYP/CBSE",
          skills: ["Context clues", "Vocabulary expansion", "Reading strategies"]
        },
        {
          id: 6,
          title: "Synonyms & Antonyms Quest",
          description: "Master word relationships and meaning connections",
          grade: "5-6",
          duration: "25 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "ICSE/CBSE/IB",
          skills: ["Synonyms", "Antonyms", "Word relationships"]
        }
      ]
    },
    {
      title: "Literary Analysis",
      icon: "🎭",
      color: "from-purple-400 to-purple-600",
      lessons: [
        {
          id: 7,
          title: "Character Study",
          description: "Analyze character traits, motivations, and development",
          grade: "3-4",
          duration: "25 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP/ICSE",
          skills: ["Character analysis", "Trait identification", "Story elements"]
        },
        {
          id: 8,
          title: "Theme & Message Finder",
          description: "Identify themes and central messages in literature",
          grade: "5-6",
          duration: "30 min",
          difficulty: 3,
          points: 25,
          completed: false,
          curriculum: "ICSE/IB PYP",
          skills: ["Theme identification", "Central message", "Literary interpretation"]
        }
      ]
    },
    {
      title: "Reading Fluency",
      icon: "🗣️",
      color: "from-orange-400 to-orange-600",
      lessons: [
        {
          id: 9,
          title: "Fluency Builder",
          description: "Practice reading with proper pace, expression, and accuracy",
          grade: "3-4",
          duration: "15 min",
          difficulty: 1,
          points: 15,
          completed: false,
          curriculum: "CBSE/ICSE",
          skills: ["Reading fluency", "Expression", "Pace control"]
        },
        {
          id: 10,
          title: "Poetry Performance",
          description: "Read and perform poetry with rhythm and expression",
          grade: "4-6",
          duration: "20 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP/CBSE",
          skills: ["Poetry reading", "Rhythm", "Performance skills"]
        }
      ]
    }
  ];

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Navigation Header */}
      <NavigationHeader 
        title="Reading Adventures"
        progress={80}
      />

      <div className="max-w-md mx-auto px-4">
        {/* Welcome Message */}
        <Card className="rounded-3xl shadow-lg mb-6 bg-gradient-to-r from-green-50 to-emerald-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Time for Reading Adventures!
              </h2>
              <p className="text-gray-600">
                Explore amazing stories and build your vocabulary!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="rounded-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="mr-2 text-kid-green" size={20} />
              Your Reading Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-green">12</div>
                <div className="text-sm text-gray-600">Stories Read</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-blue">180</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-purple">45</div>
                <div className="text-sm text-gray-600">New Words</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Story */}
        <Card className="rounded-3xl shadow-lg mb-6 bg-gradient-to-r from-blue-500 to-purple-600">
          <CardContent className="pt-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">📖 Story of the Day</h3>
                <p className="text-lg mb-1">The Magical Library</p>
                <p className="text-blue-100 text-sm mb-4">
                  A young girl discovers books that come to life!
                </p>
                <button className="bg-white text-purple-600 font-bold py-2 px-4 rounded-xl kid-button text-sm">
                  Read Now ⭐
                </button>
              </div>
              <div className="text-6xl">📖</div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Skill Areas - Comprehensive Curriculum */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Reading & Language Arts Curriculum (Grades 3-6)</h3>
          <div className="space-y-6">
            {readingSkillAreas.map((area, areaIndex) => (
              <div key={areaIndex} className="space-y-4">
                {/* Skill Area Header */}
                <Card className={cn("rounded-3xl shadow-lg bg-gradient-to-r", area.color)}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="text-4xl">{area.icon}</div>
                      <div>
                        <h2 className="text-xl font-bold mb-1">{area.title}</h2>
                        <p className="text-white/90 text-sm">
                          {area.lessons.length} lessons • ICSE/CBSE/IB curriculum
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
                            <div className="flex flex-wrap gap-1">
                              {lesson.skills.map((skill, skillIndex) => (
                                <span 
                                  key={skillIndex}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {lesson.completed ? (
                              <div className="bg-green-500 text-white rounded-full p-2">
                                <Trophy className="h-5 w-5" />
                              </div>
                            ) : (
                              <div className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors">
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

        {/* Reading Stats */}
        <Card className="rounded-3xl shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-lg">This Week's Reading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monday</span>
                <div className="flex space-x-1">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <BookOpen size={12} className="text-white" />
                  </div>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <BookOpen size={12} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tuesday</span>
                <div className="flex space-x-1">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <BookOpen size={12} className="text-white" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Today</span>
                <div className="flex space-x-1">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <BookOpen size={12} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
