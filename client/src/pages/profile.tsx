import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import { User, Star, Trophy, Calendar, Target, Award, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { data: user } = useQuery({
    queryKey: ["/api/users/username/emma"],
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/users", user?.id, "progress"],
    enabled: !!user?.id,
  });

  const { data: userAchievements } = useQuery({
    queryKey: ["/api/users", user?.id, "achievements"],
    enabled: !!user?.id,
  });

  const { data: allAchievements } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const getProgressBySubject = (subject: string) => {
    return progress?.find((p: any) => p.subject === subject)?.progressPercentage || 0;
  };

  const getUserAchievementBadges = () => {
    if (!userAchievements || !allAchievements) return [];
    return userAchievements
      .map((ua: any) => allAchievements.find((a: any) => a.id === ua.achievementId))
      .filter(Boolean);
  };

  const totalProgress = progress?.reduce((sum: number, p: any) => sum + p.progressPercentage, 0) / (progress?.length || 1) || 0;

  const subjects = [
    { name: "Math", subject: "math", icon: "🔢", color: "blue" as const },
    { name: "Reading", subject: "reading", icon: "📚", color: "green" as const },
    { name: "Science", subject: "science", icon: "🔬", color: "purple" as const },
    { name: "Art", subject: "art", icon: "🎨", color: "orange" as const },
  ];

  const weeklyActivity = [
    { day: "Mon", completed: 3 },
    { day: "Tue", completed: 2 },
    { day: "Wed", completed: 4 },
    { day: "Thu", completed: 1 },
    { day: "Fri", completed: 3 },
    { day: "Sat", completed: 2 },
    { day: "Sun", completed: 1 },
  ];

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-lg rounded-b-3xl p-4 mb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user?.name || 'Student'}</h1>
              <p className="text-gray-600">Level {user?.level || 1} Explorer</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4">
        {/* Stats Overview */}
        <Card className="rounded-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Star className="mr-2 text-kid-blue" size={20} />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-kid-blue">{user?.points || 0}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-kid-green">{Math.round(totalProgress)}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-kid-purple">{getUserAchievementBadges().length}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-kid-orange">7</div>
                <div className="text-sm text-gray-600">Days Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card className="rounded-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 text-kid-green" size={20} />
              Subject Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{subject.icon}</span>
                      <span className="font-semibold text-gray-700">{subject.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-600">
                      {getProgressBySubject(subject.subject)}%
                    </span>
                  </div>
                  <ProgressBar 
                    value={getProgressBySubject(subject.subject)} 
                    color={subject.color}
                    className="mb-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="rounded-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Award className="mr-2 text-yellow-500" size={20} />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getUserAchievementBadges().length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {getUserAchievementBadges().map((achievement: any, index: number) => (
                  <AchievementBadge
                    key={achievement?.id || index}
                    name={achievement?.name || "Badge"}
                    color={achievement?.color === "yellow" ? "yellow" : 
                           achievement?.color === "green" ? "green" : 
                           achievement?.color === "blue" ? "blue" : "purple"}
                    type={achievement?.type || "badge"}
                    size="lg"
                    animated
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🏆</div>
                <p className="text-gray-600">Complete activities to earn your first badge!</p>
              </div>
            )}
            <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 rounded-2xl kid-button">
              View All Achievements
            </button>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="rounded-3xl shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 text-kid-blue" size={20} />
              This Week's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weeklyActivity.map((day, index) => (
                <div key={day.day} className="text-center">
                  <div className="text-xs font-semibold text-gray-600 mb-2">{day.day}</div>
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold",
                      day.completed > 0 ? "bg-kid-green text-white" : "bg-gray-200 text-gray-400"
                    )}
                  >
                    {day.completed}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Great job! You completed <span className="font-bold text-kid-green">16 activities</span> this week! 🎉
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="rounded-3xl shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="mr-2 text-kid-purple" size={20} />
              This Week's Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-kid-green rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Complete 5 math activities</span>
                </div>
                <span className="text-xs font-bold text-kid-green">✓ Done</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-kid-blue rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Read 3 new stories</span>
                </div>
                <span className="text-xs font-bold text-kid-blue">2/3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-700">Try a science experiment</span>
                </div>
                <span className="text-xs font-bold text-gray-400">0/1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
