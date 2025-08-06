import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { BookOpen, Search, Filter, Star, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Library() {
  const categories = [
    { name: "All", count: 24, active: true },
    { name: "Stories", count: 12, active: false },
    { name: "Games", count: 8, active: false },
    { name: "Videos", count: 4, active: false },
  ];

  const libraryItems = [
    {
      id: 1,
      title: "The Magic Forest",
      type: "story",
      duration: 5,
      points: 15,
      rating: 5,
      difficulty: 1,
      completed: true,
      cover: "🌳",
      description: "A magical adventure through an enchanted forest",
    },
    {
      id: 2,
      title: "Addition Adventure Game",
      type: "game",
      duration: 10,
      points: 20,
      rating: 4,
      difficulty: 2,
      completed: true,
      cover: "🔢",
      description: "Fun math games with colorful characters",
    },
    {
      id: 3,
      title: "How Volcanoes Work",
      type: "video",
      duration: 8,
      points: 25,
      rating: 5,
      difficulty: 2,
      completed: false,
      cover: "🌋",
      description: "Learn about volcanoes and how they erupt",
    },
    {
      id: 4,
      title: "Space Adventures",
      type: "story",
      duration: 7,
      points: 18,
      rating: 5,
      difficulty: 2,
      completed: false,
      cover: "🚀",
      description: "Journey to the stars with brave astronauts",
    },
    {
      id: 5,
      title: "Color Mixing Lab",
      type: "game",
      duration: 12,
      points: 22,
      rating: 4,
      difficulty: 1,
      completed: false,
      cover: "🎨",
      description: "Explore colors and create beautiful art",
    },
    {
      id: 6,
      title: "Ocean Life Documentary",
      type: "video",
      duration: 15,
      points: 30,
      rating: 5,
      difficulty: 3,
      completed: false,
      cover: "🌊",
      description: "Discover amazing creatures in the deep sea",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "story": return "📖";
      case "game": return "🎮";
      case "video": return "🎬";
      default: return "📚";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "story": return "bg-green-100 text-green-700";
      case "game": return "bg-blue-100 text-blue-700";
      case "video": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-lg rounded-b-3xl p-4 mb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Learning Library</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input 
              placeholder="Search for stories, games, videos..." 
              className="pl-10 pr-12 h-12 rounded-2xl border-2 border-gray-200 focus:border-kid-blue"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-kid-blue text-white p-2 rounded-xl">
              <Filter size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4">
        {/* Category Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.name}
              className={cn(
                "px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all",
                category.active 
                  ? "bg-kid-blue text-white shadow-lg" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Featured Section */}
        <Card className="rounded-3xl shadow-lg mb-6 bg-gradient-to-r from-indigo-500 to-purple-600">
          <CardContent className="pt-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🌟 Featured Today</h3>
                <p className="text-lg mb-1">The Friendship Garden</p>
                <p className="text-indigo-100 text-sm mb-4">
                  A heartwarming story about making new friends
                </p>
                <button className="bg-white text-purple-600 font-bold py-2 px-4 rounded-xl kid-button text-sm">
                  Read Now 📚
                </button>
              </div>
              <div className="text-6xl">🌻</div>
            </div>
          </CardContent>
        </Card>

        {/* Recently Added */}
        <section className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            ⭐ Recently Added
          </h3>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {libraryItems.slice(0, 3).map((item) => (
              <Card key={item.id} className="min-w-[200px] rounded-2xl shadow-lg">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{item.cover}</div>
                    <h4 className="font-bold text-sm mb-1 line-clamp-2">{item.title}</h4>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={12} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{item.duration} min</p>
                    <button className="w-full bg-kid-blue text-white py-2 rounded-lg text-xs font-semibold">
                      {item.completed ? "Review" : "Start"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Content */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">All Content</h3>
          <div className="space-y-4">
            {libraryItems.map((item) => (
              <Card 
                key={item.id} 
                className={cn(
                  "rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                  item.completed ? "bg-green-50 border-green-200" : "bg-white"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{item.cover}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg text-gray-800 line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} size={14} className="text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs">
                          <span className={cn(
                            "px-2 py-1 rounded-full font-semibold flex items-center",
                            getTypeColor(item.type)
                          )}>
                            {getTypeIcon(item.type)} {item.type}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <Clock size={12} className="mr-1" />
                            {item.duration} min
                          </span>
                          <span className="text-kid-blue font-semibold">
                            +{item.points}
                          </span>
                        </div>
                        <button className={cn(
                          "px-4 py-2 rounded-xl font-semibold text-sm transition-colors",
                          item.completed 
                            ? "bg-green-500 text-white" 
                            : "bg-kid-blue text-white hover:bg-blue-600"
                        )}>
                          {item.completed ? "✓ Done" : "Start"}
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Card */}
        <Card className="rounded-3xl shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Library Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-blue">8</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-4">
                <div className="text-2xl font-bold text-kid-green">45</div>
                <div className="text-sm text-gray-600">Minutes Read</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
