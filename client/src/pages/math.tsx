import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { Calculator, ArrowLeft, Play, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Math() {
  const navigate = useNavigate();
  
  const handleBackToSubjects = () => {
    navigate('/subjects');
  };
  
  const mathActivities = [
    {
      id: 1,
      title: "Addition Adventure",
      description: "Learn to add numbers with fun games!",
      difficulty: 1,
      points: 10,
      completed: true,
      icon: "🔢",
    },
    {
      id: 2,
      title: "Subtraction Safari",
      description: "Explore the wild world of subtraction",
      difficulty: 2,
      points: 15,
      completed: true,
      icon: "🦁",
    },
    {
      id: 3,
      title: "Multiplication Magic",
      description: "Discover the magic of times tables",
      difficulty: 3,
      points: 20,
      completed: false,
      icon: "✨",
    },
    {
      id: 4,
      title: "Division Detective",
      description: "Solve mysteries with division",
      difficulty: 3,
      points: 20,
      completed: false,
      icon: "🕵️",
    },
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

        {/* Math Activities */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Choose an Activity</h3>
          <div className="space-y-4">
            {mathActivities.map((activity) => (
              <Card 
                key={activity.id} 
                className={cn(
                  "rounded-3xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                  activity.completed ? "bg-green-50 border-green-200" : "bg-white"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{activity.icon}</div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className={cn(
                            "px-2 py-1 rounded-full font-semibold",
                            activity.difficulty === 1 ? "bg-green-100 text-green-700" :
                            activity.difficulty === 2 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            Level {activity.difficulty}
                          </span>
                          <span className="text-kid-blue font-semibold">
                            +{activity.points} points
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      {activity.completed ? (
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Trophy className="text-white" size={24} />
                        </div>
                      ) : (
                        <button className="w-12 h-12 bg-kid-blue rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors kid-button">
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
