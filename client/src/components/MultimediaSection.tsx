import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Image, 
  Activity, 
  ExternalLink, 
  Play, 
  BookOpen,
  FileText 
} from 'lucide-react';

interface MultimediaContent {
  description: string;
  type: 'video' | 'image' | 'interactive' | 'text';
  source: string;
  link: string;
  license: string;
}

interface MultimediaTopics {
  topic: string;
  content: MultimediaContent[];
}

interface MultimediaSubject {
  subject: string;
  topics: MultimediaTopics[];
}

interface MultimediaData {
  grade: string;
  subjects: MultimediaSubject[];
}

interface MultimediaSectionProps {
  subject: string;
  title?: string;
}

const MultimediaSection: React.FC<MultimediaSectionProps> = ({ 
  subject, 
  title = "Educational Resources" 
}) => {
  const [multimediaData, setMultimediaData] = useState<MultimediaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMultimediaContent = async () => {
      try {
        const response = await fetch('/api/grade4-content');
        const data = await response.json();
        setMultimediaData(data);
      } catch (error) {
        console.error('Error fetching multimedia content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMultimediaContent();
  }, []);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'interactive': return <Activity className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getContentColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'interactive': return 'bg-blue-100 text-blue-800';
      case 'text': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openContent = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading educational content...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!multimediaData) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-4">
            Educational content currently unavailable. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const subjectData = multimediaData.subjects.find(
    s => s.subject.toLowerCase().includes(subject.toLowerCase()) || 
         subject.toLowerCase().includes(s.subject.toLowerCase())
  );

  if (!subjectData || !subjectData.topics.length) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-4">
            No multimedia content available for this subject yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Play className="h-5 w-5 mr-2 text-blue-600" />
          {title}
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Educational content from Khan Academy, PBS LearningMedia, and other trusted sources
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={subjectData.topics[0]?.topic || 'tab-0'}>
          <TabsList className="grid w-full grid-cols-2">
            {subjectData.topics.slice(0, 2).map((topic, index) => (
              <TabsTrigger 
                key={index} 
                value={topic.topic}
                className="text-xs"
              >
                {topic.topic}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {subjectData.topics.slice(0, 2).map((topic, topicIndex) => (
            <TabsContent key={topicIndex} value={topic.topic} className="mt-4">
              <div className="space-y-3">
                {topic.content.slice(0, 3).map((content, contentIndex) => (
                  <div 
                    key={contentIndex}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getContentIcon(content.type)}
                        <Badge className={getContentColor(content.type)}>
                          {content.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{content.source}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openContent(content.link)}
                        className="ml-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">
                      {content.description}
                    </p>
                    
                    <p className="text-xs text-gray-500">
                      {content.license}
                    </p>
                  </div>
                ))}
                
                {topic.content.length > 3 && (
                  <div className="text-center pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => window.open('/content-browser', '_blank')}
                    >
                      View {topic.content.length - 3} more resources
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {subjectData.topics.length > 2 && (
          <div className="mt-4 pt-4 border-t text-center">
            <Button 
              variant="outline"
              onClick={() => window.open('/content-browser', '_blank')}
            >
              Browse All {subject} Resources
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultimediaSection;