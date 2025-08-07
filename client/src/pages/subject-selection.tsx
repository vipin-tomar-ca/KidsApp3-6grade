import { Card, CardContent } from "@/components/ui/card";
import { AccessibilityToolbar, SpeakableText } from "@/components/ui/accessibility";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { ArrowLeft, BookOpen, Calculator, FlaskConical, Globe, Music, Palette, Play, Trophy } from "lucide-react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button as BootstrapButton, Container, Row, Col } from "react-bootstrap";
import { cn } from "@/lib/utils";

export default function SubjectSelection() {
  const [location, navigate] = useLocation();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const selectedGrade = 4; // Default grade for now

  const coreSubjects = [
    {
      id: "math",
      title: "Math",
      description: "Numbers, patterns, and problem solving",
      icon: Calculator,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      activities: ["Addition & Subtraction", "Multiplication Tables", "Word Problems", "Geometry Fun"]
    },
    {
      id: "english",
      title: "English",
      description: "Reading, writing, and language arts",
      icon: BookOpen,
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      activities: ["Reading Stories", "Writing Practice", "Grammar Games", "Vocabulary Building"]
    },
    {
      id: "science",
      title: "Science",
      description: "Explore the world around us",
      icon: FlaskConical,
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      activities: ["Fun Experiments", "Nature Studies", "Space Exploration", "How Things Work"]
    },
    {
      id: "social-studies",
      title: "Social Studies",
      description: "Learn about people and places",
      icon: Globe,
      color: "from-orange-500 to-orange-700",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      activities: ["World Geography", "History Stories", "Communities", "Cultures & Traditions"]
    }
  ];

  const creativeSubjects = [
    {
      id: "music",
      title: "Music",
      description: "Rhythm, melody, and musical fun",
      icon: Music,
      color: "from-pink-500 to-pink-700",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
      activities: ["Sing Along Songs", "Rhythm Games", "Instrument Fun", "Musical Stories"]
    },
    {
      id: "art",
      title: "Drawing & Art",
      description: "Create beautiful artwork",
      icon: Palette,
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      activities: ["Drawing Lessons", "Color Mixing", "Craft Projects", "Digital Art"]
    }
  ];

  const advancedSubjects = [
    {
      id: "olympiad",
      title: "Olympiad Training",
      description: "Challenge yourself with competition problems",
      icon: Trophy,
      color: "from-yellow-500 to-yellow-700",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700",
      activities: ["AMC 8 Math", "Science Olympiad", "Timed Challenges", "Problem Solving"]
    }
  ];

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setTimeout(() => {
      // Navigate to specific subject pages
      if (subjectId === 'math') {
        navigate('/math');
      } else if (subjectId === 'english') {
        navigate('/reading');
      } else if (subjectId === 'science') {
        navigate('/science');
      } else if (subjectId === 'art') {
        navigate('/art');
      } else if (subjectId === 'music') {
        navigate('/music');
      } else if (subjectId === 'olympiad') {
        navigate('/olympiad');
      } else {
        navigate(`/${subjectId}`);
      }
    }, 500);
  };

  const gradeInfo = {
    3: { title: "3rd Grade", emoji: "🌱" },
    4: { title: "4th Grade", emoji: "🌟" },
    5: { title: "5th Grade", emoji: "🚀" },
    6: { title: "6th Grade", emoji: "🏆" }
  };

  return (
    <div className="bg-kid-gradient min-h-screen">
      <AccessibilityToolbar />
      
      {/* Navigation Header */}
      <NavigationHeader 
        title={`${gradeInfo[selectedGrade as keyof typeof gradeInfo]?.title} Subjects`}
        showBack={true}
        onBack={() => navigate('/grade-selection')}
        progress={selectedGrade * 20}
        theme="light"
      />
      
      <Container fluid className="py-4">
        {/* Welcome Section */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl animate-pulse-slow mx-auto mb-4">
            <span className="text-3xl">{gradeInfo[selectedGrade as keyof typeof gradeInfo]?.emoji}</span>
          </div>
          <SpeakableText text={`Welcome to ${gradeInfo[selectedGrade as keyof typeof gradeInfo]?.title} subjects! Choose a subject to start your learning adventure.`}>
            <p className="text-xl text-gray-600">Choose your learning adventure!</p>
          </SpeakableText>
        </div>

        {/* Core Subjects */}
        <section className="mb-8">
          <SpeakableText text="Core subjects include Math, English, Science, and Social Studies">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">📚 Core Subjects</h2>
          </SpeakableText>
          
          <Row className="g-4 max-w-6xl mx-auto">
            <TransitionGroup component={null}>
              {coreSubjects.map((subject, index) => (
                <Col key={subject.id} lg={6} className="mb-4">
                  <CSSTransition
                    timeout={300}
                    classNames="subject-card"
                  >
                    <Card 
                      className={cn(
                        "rounded-3xl shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl h-100",
                        selectedSubject === subject.id ? "ring-4 ring-yellow-400 scale-105" : "",
                        "animate-float"
                      )}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => handleSubjectSelect(subject.id)}
                    >
                      <CardContent className="p-6">
                        <div className={cn("rounded-2xl p-6 mb-4 bg-gradient-to-br", subject.color)}>
                          <div className="flex items-center justify-between text-white mb-4">
                            <subject.icon size={48} className="animate-bounce-gentle" />
                            <Trophy className="opacity-80" size={24} />
                          </div>
                          <SpeakableText text={`${subject.title}: ${subject.description}`}>
                            <h3 className="text-2xl font-bold text-white mb-2">{subject.title}</h3>
                            <p className="text-white/90 text-lg">{subject.description}</p>
                          </SpeakableText>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {subject.activities.slice(0, 3).map((activity, actIndex) => (
                            <SpeakableText key={actIndex} text={activity}>
                              <div className={cn("rounded-xl p-3 text-sm font-semibold", subject.bgColor, subject.textColor)}>
                                • {activity}
                              </div>
                            </SpeakableText>
                          ))}
                          {subject.activities.length > 3 && (
                            <div className="text-sm text-gray-500 text-center">
                              +{subject.activities.length - 3} more activities
                            </div>
                          )}
                        </div>
                        
                        <BootstrapButton 
                          className={cn(
                            "w-100 py-3 font-weight-bold rounded-3 border-0 text-white d-flex align-items-center justify-content-center",
                            "kid-button transition-all"
                          )}
                          style={{ 
                            background: `linear-gradient(135deg, ${subject.color.split(' ')[1]} 0%, ${subject.color.split(' ')[3]} 100%)`,
                            fontSize: '1.1rem'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubjectSelect(subject.id);
                          }}
                        >
                          <Play className="me-2" size={20} />
                          Start Learning!
                        </BootstrapButton>
                      </CardContent>
                    </Card>
                  </CSSTransition>
                </Col>
              ))}
            </TransitionGroup>
          </Row>
        </section>

        {/* Creative Subjects */}
        <section className="mb-8">
          <SpeakableText text="Creative activities include Music and Drawing & Art">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">🎨 Creative Activities</h2>
          </SpeakableText>
          
          <Row className="g-4 max-w-4xl mx-auto">
            <TransitionGroup component={null}>
              {creativeSubjects.map((subject, index) => (
                <Col key={subject.id} md={6} className="mb-4">
                  <CSSTransition
                    timeout={300}
                    classNames="subject-card"
                  >
                    <Card 
                      className={cn(
                        "rounded-3xl shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl h-100",
                        selectedSubject === subject.id ? "ring-4 ring-yellow-400 scale-105" : "",
                        "animate-float"
                      )}
                      style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                      onClick={() => handleSubjectSelect(subject.id)}
                    >
                      <CardContent className="p-6">
                        <div className={cn("rounded-2xl p-6 mb-4 bg-gradient-to-br", subject.color)}>
                          <div className="flex items-center justify-between text-white mb-4">
                            <subject.icon size={48} className="animate-wiggle" />
                            <div className="text-2xl">✨</div>
                          </div>
                          <SpeakableText text={`${subject.title}: ${subject.description}`}>
                            <h3 className="text-2xl font-bold text-white mb-2">{subject.title}</h3>
                            <p className="text-white/90 text-lg">{subject.description}</p>
                          </SpeakableText>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {subject.activities.map((activity, actIndex) => (
                            <SpeakableText key={actIndex} text={activity}>
                              <div className={cn("rounded-xl p-3 text-sm font-semibold", subject.bgColor, subject.textColor)}>
                                • {activity}
                              </div>
                            </SpeakableText>
                          ))}
                        </div>
                        
                        <BootstrapButton 
                          className={cn(
                            "w-100 py-3 font-weight-bold rounded-3 border-0 text-white d-flex align-items-center justify-content-center",
                            "kid-button transition-all"
                          )}
                          style={{ 
                            background: `linear-gradient(135deg, ${subject.color.split(' ')[1]} 0%, ${subject.color.split(' ')[3]} 100%)`,
                            fontSize: '1.1rem'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubjectSelect(subject.id);
                          }}
                        >
                          <Play className="me-2" size={20} />
                          Get Creative!
                        </BootstrapButton>
                      </CardContent>
                    </Card>
                  </CSSTransition>
                </Col>
              ))}
            </TransitionGroup>
          </Row>
        </section>

        {/* Advanced Challenges */}
        <section className="mb-8">
          <SpeakableText text="Advanced challenge activities for competition preparation">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">🏆 Advanced Challenges</h2>
          </SpeakableText>
          
          <Row className="g-4 max-w-2xl mx-auto">
            <TransitionGroup component={null}>
              {advancedSubjects.map((subject, index) => (
                <Col key={subject.id} md={12} className="mb-4">
                  <CSSTransition
                    timeout={300}
                    classNames="subject-card"
                  >
                    <Card 
                      className={cn(
                        "rounded-3xl shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl h-100",
                        selectedSubject === subject.id ? "ring-4 ring-yellow-400 scale-105" : "",
                        "animate-float"
                      )}
                      style={{ animationDelay: `${(index + 6) * 0.1}s` }}
                      onClick={() => handleSubjectSelect(subject.id)}
                    >
                      <CardContent className="p-6">
                        <div className={cn("rounded-2xl p-6 mb-4 bg-gradient-to-br", subject.color)}>
                          <div className="flex items-center justify-between text-white mb-4">
                            <subject.icon size={48} className="animate-bounce" />
                            <div className="text-2xl">🌟</div>
                          </div>
                          <SpeakableText text={`${subject.title}: ${subject.description}`}>
                            <h3 className="text-2xl font-bold text-white mb-2">{subject.title}</h3>
                            <p className="text-white/90 text-lg">{subject.description}</p>
                          </SpeakableText>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {subject.activities.map((activity, actIndex) => (
                            <SpeakableText key={actIndex} text={activity}>
                              <div className={cn("rounded-xl p-3 text-sm font-semibold", subject.bgColor, subject.textColor)}>
                                • {activity}
                              </div>
                            </SpeakableText>
                          ))}
                        </div>
                        
                        <BootstrapButton 
                          className={cn(
                            "w-100 py-3 font-weight-bold rounded-3 border-0 text-white d-flex align-items-center justify-content-center",
                            "kid-button transition-all"
                          )}
                          style={{ 
                            background: `linear-gradient(135deg, ${subject.color.split(' ')[1]} 0%, ${subject.color.split(' ')[3]} 100%)`,
                            fontSize: '1.1rem'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubjectSelect(subject.id);
                          }}
                        >
                          <Trophy className="me-2" size={20} />
                          Start Training!
                        </BootstrapButton>
                      </CardContent>
                    </Card>
                  </CSSTransition>
                </Col>
              ))}
            </TransitionGroup>
          </Row>
        </section>

        {/* Student Workspace Section */}
        <section className="mb-8">
          <div className="max-w-4xl mx-auto">
            <Card className="rounded-3xl shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  onClick={() => navigate('/workspace')}>
              <CardContent className="p-6 text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <SpeakableText text="Student Workspace - Your digital notebook for assignments, math problems, and creative projects">
                    <h2 className="text-3xl font-bold mb-3">Student Workspace</h2>
                    <p className="text-xl text-white/90 mb-4">
                      Your digital notebook for assignments, math problems, and creative projects!
                    </p>
                  </SpeakableText>
                  <div className="d-flex justify-content-center flex-wrap gap-3 mb-4">
                    <span className="badge bg-white text-indigo-600 rounded-pill px-3 py-2">✏️ Rich Text Editor</span>
                    <span className="badge bg-white text-indigo-600 rounded-pill px-3 py-2">🔢 Math Equations</span>
                    <span className="badge bg-white text-indigo-600 rounded-pill px-3 py-2">🎨 Drawing Canvas</span>
                    <span className="badge bg-white text-indigo-600 rounded-pill px-3 py-2">💾 Auto-Save</span>
                  </div>
                  <BootstrapButton 
                    className="btn-light text-indigo-600 fw-bold py-3 px-4 rounded-3 d-flex align-items-center justify-content-center mx-auto"
                    style={{ maxWidth: '200px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/workspace');
                    }}
                  >
                    <Play className="me-2" size={20} />
                    Open Workspace
                  </BootstrapButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Fun Fact */}
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-3xl shadow-lg bg-gradient-to-r from-yellow-100 to-orange-100">
            <CardContent className="p-6 text-center">
              <SpeakableText text="Learning tip: Try different subjects each day to keep your brain active and engaged! Mix core subjects with creative activities for the best learning experience.">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Learning Tip!</h3>
                <p className="text-gray-600 text-lg">
                  Try different subjects each day to keep your brain active and engaged! 
                  Mix core subjects with creative activities for the best learning experience! 🧠✨
                </p>
              </SpeakableText>
            </CardContent>
          </Card>
        </div>
      </Container>


    </div>
  );
}