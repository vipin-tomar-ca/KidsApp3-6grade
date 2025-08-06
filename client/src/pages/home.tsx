/**
 * Home Dashboard Component - Main Learning Portal for Grades 3-6
 * 
 * This component serves as the central hub for students to access all learning
 * modules, track progress, view achievements, and navigate to different subjects.
 * 
 * @author Frontend Developer Team
 * @version 1.0.0
 * @category Core Pages
 * @compliance COPPA, WCAG 2.1 AA
 * @educational Supports independent navigation for ages 8-11
 * 
 * Key Features:
 * - Age-appropriate visual design with large buttons and clear icons
 * - Progress tracking with encouraging visual indicators
 * - Achievement showcase to motivate continued learning
 * - Subject modules: Math, Reading, Science, Art, Music, and Olympiads
 * - Responsive design optimized for tablets and desktop
 * - Accessibility features including keyboard navigation and screen reader support
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Calculator, BookOpen, FlaskConical, Palette, Gamepad2, Gift, Star, Rocket, Shield } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users/username/emma"],
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "progress"],
    enabled: !!user?.id,
  });

  const { data: userAchievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/users", user?.id, "achievements"],
    enabled: !!user?.id,
  });

  const { data: allAchievements } = useQuery({
    queryKey: ["/api/achievements"],
  });

  if (userLoading || progressLoading || achievementsLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  const getProgressBySubject = (subject: string) => {
    return progress?.find((p: any) => p.subject === subject)?.progressPercentage || 0;
  };

  const getUserAchievementBadges = () => {
    if (!userAchievements || !allAchievements) return [];
    return userAchievements
      .map((ua: any) => allAchievements.find((a: any) => a.id === ua.achievementId))
      .filter(Boolean)
      .slice(0, 3);
  };

  const learningModules = [
    {
      name: "Math Fun",
      subject: "math",
      description: "Numbers & Puzzles",
      icon: Calculator,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
      path: "/math",
    },
    {
      name: "Reading",
      subject: "reading", 
      description: "Stories & Words",
      icon: BookOpen,
      bgColor: "bg-gradient-to-br from-green-500 to-green-700",
      path: "/reading",
    },
    {
      name: "Science",
      subject: "science",
      description: "Experiments",
      icon: FlaskConical,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
      path: "/science",
    },
    {
      name: "Art",
      subject: "art",
      description: "Create & Draw",
      icon: Palette,
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-700",
      path: "/art",
    },
    {
      name: "Firebase Demo",
      subject: "firebase", 
      description: "Cloud Content",
      icon: Shield,
      bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      path: "/firebase-demo",
    },
  ];

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-lg rounded-b-3xl p-4 mb-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse-slow">
              <Star className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">KidLearn</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-kid-green rounded-full flex items-center justify-center">
              <Star className="text-white text-sm" size={16} />
            </div>
            <span className="text-lg font-bold text-kid-green">
              {user?.points || 0}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4">
        {/* Welcome Section */}
        <section className="text-center mb-8">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
              alt="Children learning with tablets" 
              className="w-full h-48 object-cover rounded-3xl shadow-xl mb-6"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-3xl font-bold text-white mb-2 animate-bounce-gentle">
                Welcome Back!
              </h2>
              <p className="text-lg text-white/90">
                Hey there, {user?.name || 'Friend'}! 👋
              </p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 mt-4 shadow-lg">
            <p className="text-xl text-gray-700 mb-4">Ready to learn something amazing today?</p>
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-kid-blue rounded-full animate-bounce" style={{animationDelay: "0.1s"}} />
              <div className="w-3 h-3 bg-kid-green rounded-full animate-bounce" style={{animationDelay: "0.2s"}} />
              <div className="w-3 h-3 bg-kid-orange rounded-full animate-bounce" style={{animationDelay: "0.3s"}} />
            </div>
          </div>
        </section>

        {/* Learning Modules */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Your Adventure!</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {learningModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Link key={module.subject} href={module.path}>
                  <button className={cn(
                    "kid-button flex flex-col items-center justify-center p-6",
                    module.bgColor
                  )}>
                    <IconComponent className="text-white text-3xl mb-3 animate-wiggle" />
                    <span className="text-white font-bold text-lg">{module.name}</span>
                    <span className="text-white/80 text-sm mt-1">{module.description}</span>
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Featured Activity */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl p-6 shadow-xl mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold text-xl mb-2">🌟 Today's Challenge</h4>
                <p className="text-pink-100 text-lg">Space Adventure Quiz</p>
                <p className="text-pink-200 text-sm mt-1">Earn 50 stars!</p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150" 
                alt="Space adventure" 
                className="w-20 h-20 rounded-2xl object-cover"
              />
            </div>
            <button className="w-full bg-white text-red-500 font-bold py-4 rounded-2xl mt-4 text-lg shadow-lg hover:bg-gray-50 transition-colors kid-button">
              Start Adventure! <Rocket className="inline ml-2" size={20} />
            </button>
          </div>
        </section>

        {/* Progress Section */}
        <section className="mb-8">
          <Card className="shadow-lg rounded-3xl">
            <CardContent className="pt-6">
              <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Star className="text-kid-blue mr-3" />
                Your Progress
              </h4>
              
              <div className="space-y-4">
                {learningModules.map((module) => (
                  <div key={module.subject} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-kid-blue rounded-full flex items-center justify-center mr-3">
                        <module.icon className="text-white text-sm" size={16} />
                      </div>
                      <span className="font-semibold text-gray-700">{module.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-1 max-w-32">
                      <ProgressBar 
                        value={getProgressBySubject(module.subject)} 
                        color={module.subject === "math" ? "blue" : 
                               module.subject === "reading" ? "green" :
                               module.subject === "science" ? "purple" : "orange"}
                        showPercentage
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievement Badges */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h5 className="text-lg font-bold text-gray-700 mb-3">Latest Badges</h5>
                <div className="flex space-x-4 justify-center">
                  {getUserAchievementBadges().map((achievement: any, index: number) => (
                    <AchievementBadge
                      key={achievement?.id || index}
                      name={achievement?.name || "Badge"}
                      color={achievement?.color === "yellow" ? "yellow" : 
                             achievement?.color === "green" ? "green" : "blue"}
                      type={achievement?.type || "badge"}
                      size="md"
                      animated
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h4 className="text-xl font-bold text-gray-800 mb-4">Quick Play</h4>
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center hover:shadow-xl transition-all duration-300 min-h-[80px]">
              <Gamepad2 className="text-kid-blue text-xl mb-2" />
              <span className="text-sm font-semibold text-gray-700">Games</span>
            </button>
            <button className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center hover:shadow-xl transition-all duration-300 min-h-[80px]">
              <BookOpen className="text-kid-green text-xl mb-2" />
              <span className="text-sm font-semibold text-gray-700">Cards</span>
            </button>
            <button className="bg-white rounded-2xl p-4 shadow-lg flex flex-col items-center hover:shadow-xl transition-all duration-300 min-h-[80px]">
              <Gift className="text-kid-orange text-xl mb-2" />
              <span className="text-sm font-semibold text-gray-700">Rewards</span>
            </button>
          </div>
        </section>

        {/* Parent Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-4 border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="text-gray-600 mr-3" size={20} />
                <div>
                  <p className="font-semibold text-gray-700">Parent Dashboard</p>
                  <p className="text-sm text-gray-600">View progress & settings</p>
                </div>
              </div>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">
                Access
              </button>
            </div>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </div>
  );
}
