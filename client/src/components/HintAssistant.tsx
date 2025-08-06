import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Brain,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Alert, Badge, Spinner } from "react-bootstrap";
import { llmHintService, HintRequest, HintResponse, HintInteraction } from '@/services/llmHintService';
import { cn } from "@/lib/utils";

interface HintAssistantProps {
  userId: string;
  subject: 'math' | 'english' | 'music' | 'art' | 'science';
  grade: number;
  context: string;
  userInput: string;
  activityType: 'problem-solving' | 'creative-writing' | 'music-composition' | 'drawing' | 'science-experiment';
  onHintGenerated?: (hint: HintResponse) => void;
  className?: string;
}

const HintAssistant: React.FC<HintAssistantProps> = ({
  userId,
  subject,
  grade,
  context,
  userInput,
  activityType,
  onHintGenerated,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentHint, setCurrentHint] = useState<HintResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentInteractions, setRecentInteractions] = useState<HintInteraction[]>([]);
  const [modelStatus, setModelStatus] = useState(llmHintService.getModelStatus());

  useEffect(() => {
    loadRecentInteractions();
    
    // Update model status periodically
    const statusInterval = setInterval(() => {
      setModelStatus(llmHintService.getModelStatus());
    }, 5000);

    return () => clearInterval(statusInterval);
  }, [userId]);

  const loadRecentInteractions = async () => {
    try {
      const interactions = await llmHintService.getInteractionHistory(userId);
      setRecentInteractions(interactions.slice(-5)); // Last 5 interactions
    } catch (error) {
      console.error('Error loading hint interactions:', error);
    }
  };

  const generateHint = async () => {
    if (!userInput.trim() && !context.trim()) {
      setCurrentHint({
        hint: "Start working on your activity and I'll be here to help when you need it!",
        confidence: 1.0,
        category: 'encourage',
        isFiltered: false,
        timestamp: new Date().toISOString()
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const request: HintRequest = {
        userId,
        subject,
        grade,
        context,
        userInput,
        activityType
      };

      const hint = await llmHintService.generateHint(request);
      setCurrentHint(hint);
      
      if (onHintGenerated) {
        onHintGenerated(hint);
      }
      
      await loadRecentInteractions();
    } catch (error) {
      console.error('Error generating hint:', error);
      setCurrentHint({
        hint: "Sorry, I'm having trouble right now. Try asking your teacher for help!",
        confidence: 0.5,
        category: 'guide',
        isFiltered: false,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHintFeedback = async (helpful: boolean) => {
    if (!currentHint) return;
    
    // Find the most recent interaction for this hint
    const recentInteraction = recentInteractions[recentInteractions.length - 1];
    if (recentInteraction) {
      await llmHintService.markHintHelpful(recentInteraction.id, helpful);
      await loadRecentInteractions();
    }
  };

  const getSubjectIcon = () => {
    switch (subject) {
      case 'math': return '🔢';
      case 'english': return '📝';
      case 'music': return '🎵';
      case 'art': return '🎨';
      case 'science': return '🔬';
      default: return '📚';
    }
  };

  const getCategoryColor = (category: HintResponse['category']) => {
    switch (category) {
      case 'encourage': return 'success';
      case 'guide': return 'primary';
      case 'explain': return 'info';
      case 'suggest': return 'warning';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: HintResponse['category']) => {
    switch (category) {
      case 'encourage': return <ThumbsUp size={14} />;
      case 'guide': return <HelpCircle size={14} />;
      case 'explain': return <Brain size={14} />;
      case 'suggest': return <Lightbulb size={14} />;
      default: return <MessageCircle size={14} />;
    }
  };

  return (
    <Card className={cn("rounded-4 shadow-lg", className)}>
      <CardHeader 
        className="cursor-pointer d-flex flex-row align-items-center justify-content-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="d-flex align-items-center">
          <div className="me-3 fs-4">{getSubjectIcon()}</div>
          <div>
            <CardTitle className="h6 mb-1 d-flex align-items-center">
              <Brain className="me-2 text-primary" size={18} />
              AI Hint Assistant
              <Badge bg="info" className="ms-2 small">Grade {grade}</Badge>
            </CardTitle>
            <p className="text-muted small mb-0">
              Get personalized hints for {subject} activities
            </p>
          </div>
        </div>
        
        <div className="d-flex align-items-center">
          {!modelStatus.isLoaded && (
            <Badge bg="warning" className="me-2 small">
              Template Mode
            </Badge>
          )}
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {/* Model Status */}
          <Alert variant={modelStatus.isLoaded ? "success" : "info"} className="mb-3">
            <div className="d-flex align-items-center">
              <Sparkles className="me-2" size={16} />
              <div>
                <strong>AI Status:</strong> {modelStatus.isLoaded ? 'Advanced AI Ready' : 'Educational Templates Active'}
                {!modelStatus.isLoaded && modelStatus.error && (
                  <div className="small text-muted mt-1">{modelStatus.error}</div>
                )}
              </div>
            </div>
          </Alert>

          {/* Get Hint Button */}
          <div className="mb-3">
            <Button
              onClick={generateHint}
              disabled={isGenerating}
              className="w-100 d-flex align-items-center justify-content-center"
            >
              {isGenerating ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Thinking...
                </>
              ) : (
                <>
                  <Lightbulb className="me-2" size={16} />
                  Get a Hint
                </>
              )}
            </Button>
          </div>

          {/* Current Hint */}
          {currentHint && (
            <Card className="mb-3 border-2" style={{ borderColor: `var(--bs-${getCategoryColor(currentHint.category)})` }}>
              <CardContent className="p-3">
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <Badge bg={getCategoryColor(currentHint.category)} className="d-flex align-items-center">
                    {getCategoryIcon(currentHint.category)}
                    <span className="ms-1 text-capitalize">{currentHint.category}</span>
                  </Badge>
                  
                  {currentHint.isFiltered && (
                    <Badge bg="danger" className="small">
                      Content Filtered
                    </Badge>
                  )}
                </div>
                
                <p className="mb-3 text-dark">{currentHint.hint}</p>
                
                <div className="d-flex align-items-center justify-content-between">
                  <small className="text-muted">
                    Confidence: {Math.round(currentHint.confidence * 100)}%
                  </small>
                  
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHintFeedback(true)}
                      className="text-success border-success"
                    >
                      <ThumbsUp size={12} className="me-1" />
                      Helpful
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHintFeedback(false)}
                      className="text-danger border-danger"
                    >
                      <ThumbsDown size={12} className="me-1" />
                      Not Helpful
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Interactions Summary */}
          {recentInteractions.length > 0 && (
            <div className="mt-3">
              <h6 className="small text-muted mb-2">Recent Hints</h6>
              <div className="row g-2">
                {recentInteractions.slice(-3).map((interaction, index) => (
                  <div key={interaction.id} className="col-12">
                    <div className="bg-light rounded-3 p-2 small">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <Badge bg={getCategoryColor(interaction.response.category)} className="me-2">
                            {interaction.response.category}
                          </Badge>
                          <span className="text-muted">
                            {interaction.request.subject}
                          </span>
                        </div>
                        
                        {interaction.helpful !== undefined && (
                          <div>
                            {interaction.helpful ? (
                              <ThumbsUp size={12} className="text-success" />
                            ) : (
                              <ThumbsDown size={12} className="text-danger" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-1 text-truncate">
                        {interaction.response.hint.substring(0, 60)}
                        {interaction.response.hint.length > 60 && '...'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Information */}
          <Alert variant="info" className="mt-3 mb-0 small">
            <div className="d-flex align-items-start">
              <HelpCircle className="me-2 mt-1" size={14} />
              <div>
                <strong>Safe Learning:</strong> All hints are filtered for educational content and logged for parental review.
                The AI focuses only on helping with schoolwork and age-appropriate learning activities.
              </div>
            </div>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
};

export default HintAssistant;