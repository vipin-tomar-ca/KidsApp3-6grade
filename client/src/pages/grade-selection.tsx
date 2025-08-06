import { Card, CardContent } from "@/components/ui/card";
import { AccessibilityToolbar, SpeakableText } from "@/components/ui/accessibility";
import { GraduationCap, ArrowRight, Star, Play, Trophy } from "lucide-react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function GradeSelection() {
  const [location, navigate] = useLocation();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const grades = [
    { 
      grade: 3, 
      title: "3rd Grade", 
      description: "Ages 8-9", 
      color: "from-green-400 to-green-600",
      icon: "🌱",
      subjects: ["Basic Math", "Reading Stories", "Fun Science"]
    },
    { 
      grade: 4, 
      title: "4th Grade", 
      description: "Ages 9-10", 
      color: "from-blue-400 to-blue-600",
      icon: "🌟",
      subjects: ["Multiplication", "Chapter Books", "Nature Studies"]
    },
    { 
      grade: 5, 
      title: "5th Grade", 
      description: "Ages 10-11", 
      color: "from-purple-400 to-purple-600",
      icon: "🚀",
      subjects: ["Fractions", "Research Projects", "Earth Science"]
    },
    { 
      grade: 6, 
      title: "6th Grade", 
      description: "Ages 11-12", 
      color: "from-orange-400 to-orange-600",
      icon: "🏆",
      subjects: ["Pre-Algebra", "Creative Writing", "Life Science"]
    },
  ];

  const handleGradeSelect = (grade: number, mode: 'learning' | 'competition' = 'learning') => {
    setSelectedGrade(grade);
    setTimeout(() => {
      if (mode === 'competition') {
        navigate('/competition');
      } else {
        navigate('/subject-selection');
      }
    }, 500);
  };

  return (
    <div className="bg-kid-gradient min-h-screen p-4">
      <AccessibilityToolbar />
      
      {/* Header */}
      <header className="text-center mb-8">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl animate-bounce-gentle">
          <GraduationCap className="text-kid-blue" size={40} />
        </div>
        <SpeakableText text="Welcome to KidLearn! Choose your grade level to get started with fun learning activities.">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to KidLearn!</h1>
          <p className="text-xl text-gray-600">Choose your grade level to get started</p>
        </SpeakableText>
      </header>

      {/* Grade Selection */}
      <div className="max-w-4xl mx-auto">
        <TransitionGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {grades.map((gradeInfo, index) => (
            <CSSTransition
              key={gradeInfo.grade}
              timeout={300}
              classNames="grade-card"
            >
              <Card 
                className={cn(
                  "rounded-3xl shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl",
                  selectedGrade === gradeInfo.grade ? "ring-4 ring-yellow-400 scale-105" : "",
                  "animate-float"
                )}
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => handleGradeSelect(gradeInfo.grade)}
              >
                <CardContent className="p-8">
                  <div className={cn("bg-gradient-to-br", gradeInfo.color, "rounded-2xl p-6 text-white mb-4")}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-6xl">{gradeInfo.icon}</div>
                      <ArrowRight className="text-white/80" size={24} />
                    </div>
                    <SpeakableText text={`${gradeInfo.title} for ${gradeInfo.description}. Click to explore subjects like ${gradeInfo.subjects.join(', ')}.`}>
                      <h2 className="text-3xl font-bold mb-2">{gradeInfo.title}</h2>
                      <p className="text-xl opacity-90">{gradeInfo.description}</p>
                    </SpeakableText>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      <Star className="text-yellow-500 mr-2" size={20} />
                      What you'll learn:
                    </h3>
                    <div className="grid gap-2">
                      {gradeInfo.subjects.map((subject, subIndex) => (
                        <SpeakableText key={subIndex} text={subject}>
                          <div className="bg-gray-100 rounded-xl p-3 text-center font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                            {subject}
                          </div>
                        </SpeakableText>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-6">
                    <button 
                      className={cn(
                        "w-full bg-gradient-to-r", 
                        gradeInfo.color,
                        "text-white font-bold py-4 rounded-2xl text-xl transition-all duration-300 kid-button shadow-lg"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGradeSelect(gradeInfo.grade);
                      }}
                    >
                      <Play className="inline-block mr-2" size={20} />
                      Start Learning
                    </button>
                    
                    <button 
                      className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold py-3 rounded-2xl text-lg transition-all duration-300 kid-button shadow-lg hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGradeSelect(gradeInfo.grade, 'competition');
                      }}
                    >
                      <Trophy className="inline-block mr-2" size={18} />
                      Compete with Best
                    </button>
                  </div>
                </CardContent>
              </Card>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>

      {/* Fun Facts */}
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <Card className="rounded-3xl shadow-lg bg-gradient-to-r from-pink-100 to-purple-100">
          <CardContent className="p-6">
            <SpeakableText text="Did you know? Learning is like playing - the more you practice, the better you get! Each grade builds on what you learned before, like building with blocks.">
              <div className="text-4xl mb-3">🧠✨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Did You Know?</h3>
              <p className="text-gray-600 text-lg">
                Learning is like playing - the more you practice, the better you get! 
                Each grade builds on what you learned before, like building with blocks! 🧱
              </p>
            </SpeakableText>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}