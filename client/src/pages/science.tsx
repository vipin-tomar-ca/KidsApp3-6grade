import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { FlaskConical, ArrowLeft, Play, Trophy, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Science() {
  const navigate = useNavigate();
  
  const handleBackToSubjects = () => {
    navigate('/subjects');
  };
  
  const scienceActivities = [
    {
      id: 1,
      title: "Volcano Eruption",
      description: "Create your own volcanic eruption!",
      type: "experiment",
      difficulty: 2,
      points: 25,
      duration: 15,
      completed: true,
      icon: "🌋",
      materials: ["Baking soda", "Vinegar", "Food coloring"],
    },
    {
      id: 2,
      title: "Rainbow Colors",
      description: "Learn about light and colors with prisms",
      type: "experiment",
      difficulty: 1,
      points: 20,
      duration: 10,
      completed: true,
      icon: "🌈",
      materials: ["Prism", "Flashlight", "White wall"],
    },
    {
      id: 3,
      title: "Magnetic Magic",
      description: "Explore the invisible force of magnetism",
      type: "experiment",
      difficulty: 2,
      points: 20,
      duration: 12,
      completed: false,
      icon: "🧲",
      materials: ["Magnets", "Metal objects", "Paper clips"],
    },
    {
      id: 4,
      title: "Space Quiz Adventure",
      description: "Test your knowledge about planets and stars",
      type: "quiz",
      difficulty: 3,
      points: 30,
      duration: 8,
      completed: false,
      icon: "🚀",
      materials: [],
    },
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

        {/* Science Activities */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Your Experiment</h3>
          <div className="space-y-4">
            {scienceActivities.map((activity) => (
              <Card 
                key={activity.id} 
                className={cn(
                  "rounded-3xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                  activity.completed ? "bg-purple-50 border-purple-200" : "bg-white"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-4xl">{activity.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800 mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center flex-wrap gap-2 text-xs mb-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full font-semibold",
                            activity.type === "experiment" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {activity.type === "experiment" ? "🧪 Experiment" : "📝 Quiz"}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <Clock size={12} className="mr-1" />
                            {activity.duration} min
                          </span>
                          <span className="text-kid-purple font-semibold">
                            +{activity.points} points
                          </span>
                        </div>
                        {activity.materials.length > 0 && (
                          <div className="text-xs text-gray-500">
                            <span className="font-semibold">Materials needed:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activity.materials.map((material, index) => (
                                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                                  {material}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 ml-4">
                      {activity.completed ? (
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                          <Trophy className="text-white" size={24} />
                        </div>
                      ) : (
                        <button className="w-12 h-12 bg-kid-purple rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors kid-button">
                          <Play className="text-white" size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
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
