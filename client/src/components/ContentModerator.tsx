import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Filter,
  Eye,
  Search,
  BookOpen,
  Globe,
  Lock
} from "lucide-react";
import { Alert, Badge, Spinner, Form, InputGroup } from "react-bootstrap";
import { 
  childSafetyService, 
  ContentItem,
  ParentalSettings 
} from '@/services/childSafetyApi';
import { cn } from "@/lib/utils";

interface ContentModeratorProps {
  subject: string;
  grade: number;
  onContentApproved?: (content: ContentItem[]) => void;
}

interface ExternalContentSource {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  apiEndpoint?: string;
  trusted: boolean;
}

const ContentModerator: React.FC<ContentModeratorProps> = ({ 
  subject, 
  grade, 
  onContentApproved 
}) => {
  const [approvedContent, setApprovedContent] = useState<ContentItem[]>([]);
  const [pendingContent, setPendingContent] = useState<ContentItem[]>([]);
  const [parentalSettings, setParentalSettings] = useState<ParentalSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSource, setActiveSource] = useState<string>('khan-academy');

  // Trusted educational content sources
  const contentSources: ExternalContentSource[] = [
    {
      id: 'khan-academy',
      name: 'Khan Academy Kids',
      description: 'Free educational content for elementary students',
      baseUrl: 'https://www.khanacademy.org',
      trusted: true
    },
    {
      id: 'ck12',
      name: 'CK-12 Foundation',
      description: 'Free textbooks and adaptive practice for K-12',
      baseUrl: 'https://www.ck12.org',
      trusted: true
    },
    {
      id: 'educational-videos',
      name: 'Educational Video Library',
      description: 'Curated educational videos for kids',
      baseUrl: 'https://example-edu-videos.com',
      trusted: true
    },
    {
      id: 'interactive-lessons',
      name: 'Interactive Lessons',
      description: 'Hands-on learning activities and simulations',
      baseUrl: 'https://example-interactive.com',
      trusted: true
    }
  ];

  useEffect(() => {
    loadParentalSettings();
    loadApprovedContent();
  }, [subject, grade]);

  const loadParentalSettings = async () => {
    try {
      const settings = await childSafetyService.getParentalSettings();
      setParentalSettings(settings);
    } catch (error) {
      console.error('Error loading parental settings:', error);
    }
  };

  const loadApprovedContent = async () => {
    try {
      setLoading(true);
      const content = await childSafetyService.getApprovedContent(subject, grade);
      setApprovedContent(content);
      onContentApproved?.(content);
    } catch (error) {
      console.error('Error loading approved content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simulate content fetching from educational sources with moderation
  const fetchAndModerateContent = async (source: ExternalContentSource, query: string = '') => {
    setLoading(true);
    
    try {
      // Simulate fetching content from external sources
      // In a real implementation, this would make API calls to Khan Academy, CK-12, etc.
      const mockContent: Omit<ContentItem, 'approved' | 'moderationStatus'>[] = [
        {
          id: `${source.id}_${Date.now()}_1`,
          title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Fundamentals for Grade ${grade}`,
          description: `Interactive lessons covering essential ${subject} concepts appropriate for ${grade}th grade students.`,
          source: source.name,
          grade,
          subject,
          topics: getSubjectTopics(subject),
          educationalValue: 4
        },
        {
          id: `${source.id}_${Date.now()}_2`,
          title: `Practice Problems: ${subject.charAt(0).toUpperCase() + subject.slice(1)}`,
          description: `Engaging practice exercises that help students master ${subject} skills through interactive activities.`,
          source: source.name,
          grade,
          subject,
          topics: getSubjectTopics(subject).slice(0, 3),
          educationalValue: 4
        },
        {
          id: `${source.id}_${Date.now()}_3`,
          title: `${subject.charAt(0).toUpperCase() + subject.slice(1)} Games and Activities`,
          description: `Fun educational games that make learning ${subject} enjoyable for elementary students.`,
          source: source.name,
          grade,
          subject,
          topics: ['games', 'interactive learning', ...getSubjectTopics(subject).slice(0, 2)],
          educationalValue: 5
        }
      ];

      // Filter content based on search query
      const filteredContent = query 
        ? mockContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.topics.some(topic => topic.toLowerCase().includes(query.toLowerCase()))
          )
        : mockContent;

      // Moderate each piece of content
      const moderatedContent = await Promise.all(
        filteredContent.map(content => childSafetyService.moderateContent(content))
      );

      // Separate approved and pending content
      const approved = moderatedContent.filter(item => item.approved);
      const pending = moderatedContent.filter(item => !item.approved && item.moderationStatus === 'pending');

      setApprovedContent(prev => [...prev, ...approved]);
      setPendingContent(prev => [...prev, ...pending]);
      
      onContentApproved?.([...approvedContent, ...approved]);

    } catch (error) {
      console.error('Error fetching and moderating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectTopics = (subject: string): string[] => {
    const topicMap: { [key: string]: string[] } = {
      math: ['addition', 'subtraction', 'multiplication', 'geometry', 'fractions', 'problem solving'],
      english: ['reading', 'writing', 'vocabulary', 'grammar', 'phonics', 'comprehension'],
      science: ['animals', 'plants', 'weather', 'space', 'experiments', 'scientific method'],
      'social-studies': ['geography', 'history', 'communities', 'cultures', 'maps', 'citizenship'],
      art: ['drawing', 'painting', 'colors', 'creativity', 'art history', 'crafts'],
      music: ['rhythm', 'melody', 'instruments', 'singing', 'music appreciation', 'composition']
    };
    
    return topicMap[subject] || ['educational content'];
  };

  const handleContentSearch = () => {
    const selectedSource = contentSources.find(source => source.id === activeSource);
    if (selectedSource) {
      fetchAndModerateContent(selectedSource, searchQuery);
    }
  };

  const getModerationStatusBadge = (item: ContentItem) => {
    switch (item.moderationStatus) {
      case 'approved':
        return <Badge bg="success"><CheckCircle size={14} className="me-1" />Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger"><XCircle size={14} className="me-1" />Rejected</Badge>;
      case 'pending':
        return <Badge bg="warning"><AlertTriangle size={14} className="me-1" />Pending Review</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getEducationalValueStars = (value: number) => {
    return '⭐'.repeat(Math.floor(value)) + '☆'.repeat(5 - Math.floor(value));
  };

  return (
    <div>
      <Card className="rounded-4 shadow-lg mb-4">
        <CardHeader>
          <CardTitle className="h5 fw-bold d-flex align-items-center">
            <Shield className="me-2 text-primary" />
            Content Safety & Moderation
          </CardTitle>
          <p className="text-muted mb-0">
            All educational content is automatically filtered and approved for child safety
          </p>
        </CardHeader>
        <CardContent>
          {/* Content Source Selection */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Educational Content Sources</h6>
            <div className="row g-3">
              {contentSources.map(source => (
                <div key={source.id} className="col-md-6">
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all border-2",
                      activeSource === source.id ? "border-primary bg-primary bg-opacity-10" : "border-light"
                    )}
                    onClick={() => setActiveSource(source.id)}
                  >
                    <CardContent className="p-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="fw-bold mb-0">{source.name}</h6>
                        {source.trusted && (
                          <Badge bg="success" className="small">
                            <Shield size={12} className="me-1" />
                            Trusted
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted small mb-0">{source.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Content Search */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Search Educational Content</h6>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={`Search for ${subject} content for grade ${grade}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleContentSearch()}
              />
              <Button 
                variant="primary" 
                onClick={handleContentSearch}
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <Search size={16} />
                )}
              </Button>
            </InputGroup>
            <div className="small text-muted mt-2">
              Content will be automatically moderated before being made available
            </div>
          </div>

          {/* Safety Features Alert */}
          <Alert variant="success" className="mb-4">
            <Shield className="me-2" size={20} />
            <strong>COPPA & GDPR-K Compliance:</strong>
            <ul className="mb-0 mt-2 small">
              <li>All content is filtered through educational topic whitelists</li>
              <li>Blocked categories include personal information requests, ads, and inappropriate content</li>
              <li>Content requires parental approval when enabled in settings</li>
              <li>No external links or user-generated content allowed</li>
            </ul>
          </Alert>
        </CardContent>
      </Card>

      {/* Approved Content */}
      <Card className="rounded-4 shadow-lg mb-4">
        <CardHeader>
          <CardTitle className="h6 fw-bold d-flex align-items-center">
            <CheckCircle className="me-2 text-success" />
            Approved Educational Content ({approvedContent.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedContent.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <BookOpen size={48} className="mb-3 opacity-50" />
              <p>No approved content available yet.</p>
              <p className="small">Search for educational materials above to get started!</p>
            </div>
          ) : (
            <div className="row g-3">
              {approvedContent.map(item => (
                <div key={item.id} className="col-md-6">
                  <Card className="border-success border-2 bg-success bg-opacity-10">
                    <CardContent className="p-3">
                      <div className="d-flex align-items-start justify-content-between mb-2">
                        <h6 className="fw-bold text-success mb-0">{item.title}</h6>
                        {getModerationStatusBadge(item)}
                      </div>
                      <p className="small text-muted mb-2">{item.description}</p>
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="small">
                          <strong>Source:</strong> {item.source}
                        </div>
                        <div className="small">
                          <strong>Grade:</strong> {item.grade}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="small text-muted mb-1">Educational Value:</div>
                        <div>{getEducationalValueStars(item.educationalValue)}</div>
                      </div>
                      
                      <div className="topics-wrapper">
                        <div className="small text-muted mb-1">Topics:</div>
                        <div className="d-flex flex-wrap gap-1">
                          {item.topics.slice(0, 4).map(topic => (
                            <Badge key={topic} bg="light" text="dark" className="small">
                              {topic}
                            </Badge>
                          ))}
                          {item.topics.length > 4 && (
                            <Badge bg="light" text="muted" className="small">
                              +{item.topics.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Content (if parental approval is required) */}
      {parentalSettings?.contentApprovalRequired && pendingContent.length > 0 && (
        <Card className="rounded-4 shadow-lg">
          <CardHeader>
            <CardTitle className="h6 fw-bold d-flex align-items-center">
              <AlertTriangle className="me-2 text-warning" />
              Pending Parental Review ({pendingContent.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="warning" className="mb-3">
              <Lock className="me-2" />
              The following content requires parental approval before being available to students.
            </Alert>
            
            <div className="row g-3">
              {pendingContent.map(item => (
                <div key={item.id} className="col-md-6">
                  <Card className="border-warning">
                    <CardContent className="p-3">
                      <div className="d-flex align-items-start justify-content-between mb-2">
                        <h6 className="fw-bold mb-0">{item.title}</h6>
                        {getModerationStatusBadge(item)}
                      </div>
                      <p className="small text-muted mb-2">{item.description}</p>
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="small">
                          <strong>Source:</strong> {item.source}
                        </div>
                        <div className="small">
                          Educational Value: {getEducationalValueStars(item.educationalValue)}
                        </div>
                      </div>
                      
                      <div className="small text-muted">
                        Requires parental dashboard approval to access
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentModerator;