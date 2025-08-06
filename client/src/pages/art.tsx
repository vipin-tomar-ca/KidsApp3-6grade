import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Palette, ArrowLeft, Play, Trophy, Clock, Brush } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Art() {
  const artActivities = [
    {
      id: 1,
      title: "Rainbow Painting",
      description: "Create beautiful rainbow artwork!",
      type: "drawing",
      difficulty: 1,
      points: 15,
      duration: 20,
      completed: true,
      icon: "🌈",
      materials: ["Paint", "Brushes", "Paper"],
    },
    {
      id: 2,
      title: "Clay Animals",
      description: "Sculpt your favorite animals with clay",
      type: "sculpture",
      difficulty: 2,
      points: 25,
      duration: 30,
      completed: true,
      icon: "🐘",
      materials: ["Clay", "Sculpting tools", "Paint"],
    },
    {
      id: 3,
      title: "Paper Collage",
      description: "Make amazing pictures with cut paper",
      type: "collage",
      difficulty: 1,
      points: 18,
      duration: 25,
      completed: false,
      icon: "✂️",
      materials: ["Colored paper", "Scissors", "Glue"],
    },
    {
      id: 4,
      title: "Digital Art Creator",
      description: "Draw and paint on screen with digital tools",
      type: "digital",
      difficulty: 2,
      points: 22,
      duration: 15,
      completed: false,
      icon: "💻",
      materials: [],
    },
  ];

  const colorPalette = [
    { name: "Sunset Orange", color: "bg-orange-400", used: true },
    { name: "Ocean Blue", color: "bg-blue-500", used: true },
    { name: "Forest Green", color: "bg-green-500", used: false },
    { name: "Royal Purple", color: "bg-purple-500", used: true },
    { name: "Sunshine Yellow", color: "bg-yellow-400", used: false },
    { name: "Cotton Candy Pink", color: "bg-pink-400", used: true },
  ];

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-lg rounded-b-3xl p-4 mb-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center animate-pulse-slow">
              <Palette className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Art Studio</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-500" size={20} />
            <span className="text-lg font-bold text-gray-700">60%</span>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4">
        {/* Welcome Message */}
        <Card className="rounded-3xl shadow-lg mb-6 bg-gradient-to-r from-orange-50 to-pink-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Art Studio!
              </h2>
              <p className="text-gray-600">
                Express yourself and create amazing artwork!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="rounded-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Palette className="mr-2 text-kid-orange" size={20} />
              Your Art Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-orange-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-orange">6</div>
                <div className="text-sm text-gray-600">Artworks</div>
              </div>
              <div className="bg-pink-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-pink">95</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-purple">4</div>
                <div className="text-sm text-gray-600">Colors Used</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card className="rounded-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Brush className="mr-2 text-kid-orange" size={20} />
              Today's Color Palette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {colorPalette.map((color, index) => (
                <div key={index} className="text-center">
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-full mx-auto mb-2 shadow-lg transition-all",
                      color.color,
                      color.used ? "ring-2 ring-gray-300" : "opacity-60"
                    )}
                  />
                  <span className="text-xs text-gray-600">{color.name}</span>
                  {color.used && <div className="text-xs text-green-600 font-semibold">✓ Used</div>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Project */}
        <Card className="rounded-3xl shadow-lg mb-6 bg-gradient-to-r from-pink-500 to-purple-600">
          <CardContent className="pt-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  ⭐ Featured Project
                </h3>
                <p className="text-lg mb-1">Magical Unicorn Drawing</p>
                <p className="text-pink-100 text-sm mb-4">
                  Draw a beautiful unicorn with sparkles and rainbows!
                </p>
                <button className="bg-white text-pink-600 font-bold py-2 px-4 rounded-xl kid-button text-sm">
                  Start Creating 🦄
                </button>
              </div>
              <div className="text-6xl">🦄</div>
            </div>
          </CardContent>
        </Card>

        {/* Art Activities */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Your Art Activity</h3>
          <div className="space-y-4">
            {artActivities.map((activity) => (
              <Card 
                key={activity.id} 
                className={cn(
                  "rounded-3xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                  activity.completed ? "bg-orange-50 border-orange-200" : "bg-white"
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
                            activity.type === "drawing" ? "bg-orange-100 text-orange-700" :
                            activity.type === "sculpture" ? "bg-purple-100 text-purple-700" :
                            activity.type === "collage" ? "bg-green-100 text-green-700" :
                            "bg-blue-100 text-blue-700"
                          )}>
                            {activity.type === "drawing" ? "✏️ Drawing" :
                             activity.type === "sculpture" ? "🏺 Sculpture" :
                             activity.type === "collage" ? "✂️ Collage" : "💻 Digital"}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <Clock size={12} className="mr-1" />
                            {activity.duration} min
                          </span>
                          <span className="text-kid-orange font-semibold">
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
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <Trophy className="text-white" size={24} />
                        </div>
                      ) : (
                        <button className="w-12 h-12 bg-kid-orange rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors kid-button">
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

        {/* Gallery Preview */}
        <Card className="rounded-3xl shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Art Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-yellow-200 to-orange-300 rounded-2xl p-4 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">🌈</div>
                  <p className="text-sm font-semibold text-gray-700">Rainbow Art</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-200 to-purple-300 rounded-2xl p-4 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl mb-2">🐘</div>
                  <p className="text-sm font-semibold text-gray-700">Clay Elephant</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 bg-kid-orange text-white font-bold py-3 rounded-2xl kid-button">
              View Full Gallery 🖼️
            </button>
          </CardContent>
        </Card>

        {/* Art Tips */}
        <Card className="rounded-3xl shadow-lg mb-8 bg-gradient-to-r from-teal-400 to-blue-500">
          <CardContent className="pt-6 text-white">
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2">Art Tip of the Day</h3>
              <p className="text-blue-100 text-lg mb-4">
                Try mixing colors to create new ones! 
                Red + Yellow = Orange 🧡
              </p>
              <button className="bg-white text-blue-600 font-bold py-2 px-4 rounded-xl kid-button text-sm">
                More Art Tips! 🎨
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
