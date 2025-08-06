import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { NavigationHeader } from "@/components/ui/navigation-header";
import MultimediaSection from "@/components/MultimediaSection";
import { Calculator, ArrowLeft, Play, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Math() {
  const navigate = useNavigate();
  
  const handleBackToSubjects = () => {
    navigate('/subjects');
  };
  
  // Comprehensive Mathematics Curriculum based on ICSE, CBSE & IB standards
  const mathSkillAreas = [
    {
      title: "Number & Operations",
      icon: "🔢",
      color: "from-blue-400 to-blue-600",
      lessons: [
        {
          id: 1,
          title: "Place Value Explorer",
          description: "Master numbers up to 10,000 with place value understanding",
          grade: "3-4",
          duration: "20 min",
          difficulty: 1,
          points: 15,
          completed: true,
          curriculum: "ICSE/CBSE",
          skills: ["Number recognition", "Place value", "Comparing numbers"]
        },
        {
          id: 2,
          title: "Number Line Adventures",
          description: "Explore integers and number relationships on the number line",
          grade: "5-6",
          duration: "25 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP",
          skills: ["Integers", "Number ordering", "Mathematical operations"]
        },
        {
          id: 3,
          title: "Fraction Fundamentals",
          description: "Understanding fractions, decimals and their relationships",
          grade: "4-6",
          duration: "30 min",
          difficulty: 3,
          points: 25,
          completed: false,
          curriculum: "ICSE/CBSE/IB",
          skills: ["Fractions", "Decimals", "Equivalent forms"]
        }
      ]
    },
    {
      title: "Geometry & Measurement",
      icon: "📐",
      color: "from-green-400 to-green-600",
      lessons: [
        {
          id: 4,
          title: "Shape Detective",
          description: "Identify and classify 2D and 3D shapes with their properties",
          grade: "3-4",
          duration: "25 min",
          difficulty: 1,
          points: 15,
          completed: true,
          curriculum: "CBSE EVS/IB PYP",
          skills: ["2D shapes", "3D shapes", "Properties identification"]
        },
        {
          id: 5,
          title: "Measurement Masters",
          description: "Explore length, weight, time and capacity with real-world problems",
          grade: "4-5",
          duration: "30 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "ICSE/CBSE",
          skills: ["Units conversion", "Measurement tools", "Real-world applications"]
        },
        {
          id: 6,
          title: "Area & Perimeter Quest",
          description: "Calculate area and perimeter of different shapes",
          grade: "5-6",
          duration: "35 min",
          difficulty: 3,
          points: 25,
          completed: false,
          curriculum: "ICSE/IB PYP",
          skills: ["Area calculation", "Perimeter", "Complex shapes"]
        }
      ]
    },
    {
      title: "Patterns & Algebra",
      icon: "🧩",
      color: "from-purple-400 to-purple-600",
      lessons: [
        {
          id: 7,
          title: "Pattern Recognition",
          description: "Discover and extend number and shape patterns",
          grade: "3-4",
          duration: "20 min",
          difficulty: 1,
          points: 15,
          completed: false,
          curriculum: "IB PYP/CBSE",
          skills: ["Number patterns", "Shape patterns", "Sequence building"]
        },
        {
          id: 8,
          title: "Algebraic Thinking",
          description: "Introduction to variables and simple equations",
          grade: "5-6",
          duration: "30 min",
          difficulty: 3,
          points: 25,
          completed: false,
          curriculum: "ICSE/IB PYP",
          skills: ["Variables", "Simple equations", "Algebraic expressions"]
        }
      ]
    },
    {
      title: "Data Handling",
      icon: "📊",
      color: "from-orange-400 to-orange-600",
      lessons: [
        {
          id: 9,
          title: "Data Collection Fun",
          description: "Collect, organize and represent simple data",
          grade: "3-4",
          duration: "25 min",
          difficulty: 1,
          points: 15,
          completed: false,
          curriculum: "CBSE/IB PYP",
          skills: ["Data collection", "Simple graphs", "Data interpretation"]
        },
        {
          id: 10,
          title: "Graph Masters",
          description: "Create and analyze bar graphs, pictographs and simple charts",
          grade: "5-6",
          duration: "30 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "ICSE/CBSE/IB",
          skills: ["Bar graphs", "Pictographs", "Data analysis"]
        }
      ]
    }
  ];

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Navigation Header */}
      <NavigationHeader 
        title="Math Fun"
        progress={75}
      />

      <div className="max-w-md mx-auto px-4">
        {/* Welcome Message */}
        <Card className="rounded-3xl shadow-lg mb-6 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔢</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Ready for Math Adventures?
              </h2>
              <p className="text-gray-600">
                Let's explore numbers and solve fun puzzles together!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Multimedia Educational Resources */}
        <MultimediaSection subject="Math" title="Khan Academy & Educational Videos" />

        {/* Progress Overview */}
        <Card className="rounded-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calculator className="mr-2 text-kid-blue" size={20} />
              Your Math Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-blue">15</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-green">150</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-sm text-gray-600">Badges</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Math Skill Areas - Comprehensive Curriculum */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Mathematics Curriculum (Grades 3-6)</h3>
          <div className="space-y-6">
            {mathSkillAreas.map((area, areaIndex) => (
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
                              <div className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors">
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

        {/* Quick Practice */}
        <Card className="rounded-3xl shadow-lg mb-8 bg-gradient-to-r from-purple-500 to-pink-500">
          <CardContent className="pt-6 text-center">
            <div className="text-white">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Quick Practice</h3>
              <p className="mb-4 text-purple-100">
                Test your math skills with a 2-minute challenge!
              </p>
              <button className="bg-white text-purple-600 font-bold py-3 px-6 rounded-2xl kid-button hover:bg-gray-50 transition-colors">
                Start Challenge
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
