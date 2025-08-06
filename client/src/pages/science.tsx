import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { NavigationHeader } from "@/components/ui/navigation-header";
import MultimediaSection from "@/components/MultimediaSection";
import { FlaskConical, ArrowLeft, Play, Trophy, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Science() {
  const navigate = useNavigate();
  
  const handleBackToSubjects = () => {
    navigate('/subjects');
  };
  
  // Comprehensive Science Curriculum based on ICSE, CBSE EVS & IB PYP standards
  const scienceSkillAreas = [
    {
      title: "Living & Non-Living World",
      icon: "🌱",
      color: "from-green-400 to-green-600",
      lessons: [
        {
          id: 1,
          title: "Living vs Non-Living",
          description: "Explore characteristics that distinguish living from non-living things",
          grade: "3-4",
          duration: "20 min",
          difficulty: 1,
          points: 15,
          completed: true,
          curriculum: "CBSE EVS/ICSE",
          skills: ["Classification", "Observation", "Scientific thinking"],
          type: "inquiry"
        },
        {
          id: 2,
          title: "Plant Life Cycles",
          description: "Discover how plants grow, reproduce, and adapt",
          grade: "4-5",
          duration: "30 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP/CBSE EVS",
          skills: ["Life cycles", "Plant biology", "Environmental science"],
          type: "investigation"
        },
        {
          id: 3,
          title: "Animal Adaptations",
          description: "Learn how animals adapt to their environments",
          grade: "5-6",
          duration: "25 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "ICSE/IB PYP",
          skills: ["Adaptations", "Habitats", "Evolution basics"],
          type: "exploration"
        }
      ]
    },
    {
      title: "Matter & Materials",
      icon: "⚗️",
      color: "from-blue-400 to-blue-600",
      lessons: [
        {
          id: 4,
          title: "States of Matter",
          description: "Explore solids, liquids, and gases through hands-on experiments",
          grade: "3-4",
          duration: "25 min",
          difficulty: 1,
          points: 15,
          completed: true,
          curriculum: "CBSE EVS/ICSE",
          skills: ["Matter states", "Physical changes", "Observation"],
          type: "experiment"
        },
        {
          id: 5,
          title: "Properties of Materials",
          description: "Investigate material properties like hardness, flexibility, and transparency",
          grade: "4-5",
          duration: "30 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "IB PYP/ICSE",
          skills: ["Material properties", "Classification", "Scientific method"],
          type: "investigation"
        },
        {
          id: 6,
          title: "Chemical vs Physical Changes",
          description: "Distinguish between chemical and physical changes in matter",
          grade: "5-6",
          duration: "35 min",
          difficulty: 3,
          points: 25,
          completed: false,
          curriculum: "ICSE/IB PYP",
          skills: ["Chemical changes", "Physical changes", "Scientific analysis"],
          type: "experiment"
        }
      ]
    },
    {
      title: "Forces & Energy",
      icon: "⚡",
      color: "from-yellow-400 to-yellow-600",
      lessons: [
        {
          id: 7,
          title: "Push, Pull & Motion",
          description: "Understand forces and how they cause objects to move",
          grade: "3-4",
          duration: "20 min",
          difficulty: 1,
          points: 15,
          completed: false,
          curriculum: "CBSE EVS/ICSE",
          skills: ["Forces", "Motion", "Cause and effect"],
          type: "hands-on"
        },
        {
          id: 8,
          title: "Simple Machines",
          description: "Explore levers, pulleys, and inclined planes",
          grade: "5-6",
          duration: "30 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "ICSE/IB PYP",
          skills: ["Simple machines", "Mechanical advantage", "Problem solving"],
          type: "investigation"
        }
      ]
    },
    {
      title: "Earth & Environment",
      icon: "🌍",
      color: "from-emerald-400 to-emerald-600",
      lessons: [
        {
          id: 9,
          title: "Weather Patterns",
          description: "Observe and predict weather changes and patterns",
          grade: "3-4",
          duration: "25 min",
          difficulty: 1,
          points: 15,
          completed: false,
          curriculum: "CBSE EVS/IB PYP",
          skills: ["Weather observation", "Pattern recognition", "Data collection"],
          type: "inquiry"
        },
        {
          id: 10,
          title: "Water Cycle Journey",
          description: "Follow water as it moves through the environment",
          grade: "4-6",
          duration: "30 min",
          difficulty: 2,
          points: 20,
          completed: false,
          curriculum: "ICSE/CBSE EVS/IB",
          skills: ["Water cycle", "Environmental systems", "Process understanding"],
          type: "exploration"
        }
      ]
    }
  ];

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Navigation Header */}
      <NavigationHeader 
        title="Science Lab"
        progress={50}
      />

      <div className="max-w-md mx-auto px-4">
        {/* Welcome Message */}
        <Card className="rounded-3xl shadow-lg mb-6 bg-gradient-to-r from-purple-50 to-indigo-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🔬</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Let's Explore Science!
              </h2>
              <p className="text-gray-600">
                Discover amazing experiments and learn how things work!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Multimedia Educational Resources */}
        <MultimediaSection subject="Science" title="PBS LearningMedia & Science Videos" />

        {/* Progress Overview */}
        <Card className="rounded-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FlaskConical className="mr-2 text-kid-purple" size={20} />
              Your Science Lab
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-purple-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-purple">8</div>
                <div className="text-sm text-gray-600">Experiments</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-blue">120</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-green">2</div>
                <div className="text-sm text-gray-600">Discoveries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Experiment */}
        <Card className="rounded-3xl shadow-lg mb-6 bg-gradient-to-r from-orange-500 to-red-500">
          <CardContent className="pt-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <Zap className="mr-2" size={20} />
                  Experiment of the Day
                </h3>
                <p className="text-lg mb-1">Dancing Raisins</p>
                <p className="text-orange-100 text-sm mb-4">
                  Make raisins dance in carbonated water!
                </p>
                <button className="bg-white text-orange-600 font-bold py-2 px-4 rounded-xl kid-button text-sm">
                  Start Experiment ⚡
                </button>
              </div>
              <div className="text-6xl">🥤</div>
            </div>
          </CardContent>
        </Card>

        {/* Science Skill Areas - Comprehensive Curriculum */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Science Curriculum (Grades 3-6)</h3>
          <div className="space-y-6">
            {scienceSkillAreas.map((area, areaIndex) => (
              <div key={areaIndex} className="space-y-4">
                {/* Skill Area Header */}
                <Card className={cn("rounded-3xl shadow-lg bg-gradient-to-r", area.color)}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="text-4xl">{area.icon}</div>
                      <div>
                        <h2 className="text-xl font-bold mb-1">{area.title}</h2>
                        <p className="text-white/90 text-sm">
                          {area.lessons.length} lessons • ICSE/CBSE EVS/IB PYP curriculum
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
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {lesson.type}
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

        {/* Science Fun Facts */}
        <Card className="rounded-3xl shadow-lg mb-8 bg-gradient-to-r from-teal-400 to-cyan-500">
          <CardContent className="pt-6 text-white">
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-2">Did You Know?</h3>
              <p className="text-cyan-100 text-lg mb-4">
                A group of flamingos is called a "flamboyance"! 
                They get their pink color from eating shrimp and algae.
              </p>
              <button className="bg-white text-cyan-600 font-bold py-2 px-4 rounded-xl kid-button text-sm">
                More Fun Facts! 🦩
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Lab Safety Tips */}
        <Card className="rounded-3xl shadow-lg mb-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-yellow-700">
              ⚠️ Safety First!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-yellow-800">
              <p>• Always ask an adult for help with experiments</p>
              <p>• Wash your hands before and after activities</p>
              <p>• Keep your workspace clean and organized</p>
              <p>• Have fun while learning safely!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
