import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccessibilityToolbar } from "@/components/ui/accessibility";
import CompetitiveChallenge from "@/components/CompetitiveChallenge";
import { Trophy, ArrowLeft, Crown, Medal, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

export default function CompetitionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [showChallenge, setShowChallenge] = useState(false);

  useEffect(() => {
    if (location.state?.selectedGrade) {
      setSelectedGrade(location.state.selectedGrade);
      setShowChallenge(true);
    }
  }, [location]);

  const handleChallengeComplete = (score: number, totalQuestions: number) => {
    console.log(`Challenge completed! Score: ${score}/${totalQuestions}`);
  };

  const handleBackToGrades = () => {
    navigate('/grade-selection');
  };

  if (showChallenge) {
    return (
      <div className="bg-kid-gradient min-h-screen">
        <AccessibilityToolbar />
        <Container>
          <div className="py-4">
            <Button
              variant="outline"
              onClick={handleBackToGrades}
              className="mb-4"
            >
              <ArrowLeft size={16} className="me-2" />
              Back to Grade Selection
            </Button>
            
            <CompetitiveChallenge
              grade={selectedGrade}
              onComplete={handleChallengeComplete}
              onClose={handleBackToGrades}
            />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-kid-gradient min-h-screen p-4">
      <AccessibilityToolbar />
      
      {/* Header */}
      <header className="text-center mb-8">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl animate-bounce-gentle">
          <Crown className="text-yellow-500" size={40} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Competition Arena</h1>
        <p className="text-xl text-gray-600">Choose your grade to start competing!</p>
      </header>

      {/* Grade Selection for Competition */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[3, 4, 5, 6].map((grade) => (
            <Card key={grade} className="rounded-3xl shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-yellow-400 to-red-600 rounded-2xl p-6 text-white mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-6xl">
                      {grade === 3 && "🏅"}
                      {grade === 4 && "🏆"}
                      {grade === 5 && "👑"}
                      {grade === 6 && "🎖️"}
                    </div>
                    <Trophy className="text-white/80" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Grade {grade} Championship</h2>
                  <p className="text-xl opacity-90">
                    {grade === 3 && "Foundation Champions"}
                    {grade === 4 && "Knowledge Masters"}
                    {grade === 5 && "Academic Experts"}
                    {grade === 6 && "Elite Scholars"}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <Target className="text-blue-500 mr-2" size={20} />
                    Challenge Features:
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-gray-100 rounded-xl p-3">
                      <Medal className="inline-block mr-2 text-yellow-500" size={16} />
                      Questions from real competitions (AMC 8, Science Olympiad)
                    </div>
                    <div className="bg-gray-100 rounded-xl p-3">
                      <Trophy className="inline-block mr-2 text-blue-500" size={16} />
                      Timed challenges with bonus points for speed
                    </div>
                    <div className="bg-gray-100 rounded-xl p-3">
                      <Crown className="inline-block mr-2 text-purple-500" size={16} />
                      Track streaks and compete for highest scores
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-bold py-4 rounded-2xl text-xl transition-all duration-300 kid-button shadow-lg hover:scale-105"
                  onClick={() => {
                    setSelectedGrade(grade);
                    setShowChallenge(true);
                  }}
                >
                  <Trophy className="mr-2" size={20} />
                  Start Grade {grade} Challenge
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <Button
          variant="outline"
          onClick={handleBackToGrades}
          className="px-6 py-3 rounded-2xl"
        >
          <ArrowLeft size={16} className="me-2" />
          Back to Grade Selection
        </Button>
      </div>
    </div>
  );
}