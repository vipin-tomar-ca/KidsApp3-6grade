import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { BookOpen, ArrowLeft, Play, Trophy, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Reading() {
  const navigate = useNavigate();
  
  const handleBackToSubjects = () => {
    navigate('/subjects');
  };
  
  const readingActivities = [
    {
      id: 1,
      title: "The Magic Forest",
      description: "A story about friendship and adventure",
      type: "story",
      difficulty: 1,
      points: 15,
      duration: 5,
      completed: true,
      cover: "🌳",
    },
    {
      id: 2,
      title: "Space Explorers",
      description: "Journey to the stars with brave astronauts",
      type: "story",
      difficulty: 2,
      points: 20,
      duration: 8,
      completed: true,
      cover: "🚀",
    },
    {
      id: 3,
      title: "Ocean Adventures", 
      description: "Dive deep into the mysterious ocean",
      type: "story",
      difficulty: 2,
      points: 20,
      duration: 7,
      completed: false,
      cover: "🌊",
    },
    {
      id: 4,
      title: "Word Builder Game",
      description: "Build new words and learn their meanings",
      type: "game",
      difficulty: 1,
      points: 10,
      duration: 10,
      completed: false,
      cover: "📝",
    },
  ];

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-lg rounded-b-3xl p-4 mb-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleBackToSubjects}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-700 rounded-2xl flex items-center justify-center animate-pulse-slow">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Reading</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-500" size={20} />
            <span className="text-lg font-bold text-gray-700">80%</span>
          </div>
        </div>
      </header>

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

        {/* Reading Activities */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Your Adventure</h3>
          <div className="space-y-4">
            {readingActivities.map((activity) => (
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
                      <div className="text-4xl">{activity.cover}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800 mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className={cn(
                            "px-2 py-1 rounded-full font-semibold",
                            activity.type === "story" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                          )}>
                            {activity.type === "story" ? "📖 Story" : "🎮 Game"}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <Clock size={12} className="mr-1" />
                            {activity.duration} min
                          </span>
                          <span className="text-kid-green font-semibold">
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
                        <button className="w-12 h-12 bg-kid-green rounded-full flex items-center justify-center hover:bg-green-600 transition-colors kid-button">
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
