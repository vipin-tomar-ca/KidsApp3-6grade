import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Download, BookOpen, Video, Image, Activity } from 'lucide-react';
import axios from 'axios';
import localforage from 'localforage';
import ReactAudioPlayer from 'react-audio-player';

interface ContentItem {
  description: string;
  type: 'video' | 'image' | 'audio' | 'interactive' | 'text';
  source: string;
  link: string;
  license: string;
}

interface Topic {
  topic: string;
  content: ContentItem[];
}

interface Subject {
  subject: string;
  topics: Topic[];
}

interface Grade4Content {
  grade: string;
  subjects: Subject[];
  notes: {
    integration: string;
    safety: string;
    attribution: string;
  };
}

interface ContentViewerProps {
  selectedSubject?: string;
  onContentSelect?: (content: ContentItem) => void;
}

export const ContentViewer: React.FC<ContentViewerProps> = ({ 
  selectedSubject = 'Math', 
  onContentSelect 
}) => {
  const [contentData, setContentData] = useState<Grade4Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [cachedContent, setCachedContent] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState(selectedSubject);

  useEffect(() => {
    loadContentData();
  }, []);

  const loadContentData = async () => {
    try {
      // First try to load from cache
      const cached = await localforage.getItem<Grade4Content>('grade4-content');
      if (cached) {
        setContentData(cached);
        setLoading(false);
        return;
      }

      // Load from JSON file via API endpoint
      const response = await fetch('/api/grade4-content');
      if (!response.ok) {
        throw new Error('Failed to fetch Grade 4 content');
      }
      const data: Grade4Content = await response.json();
      
      // Cache the content data
      await localforage.setItem('grade4-content', data);
      setContentData(data);
      
      // Pre-cache essential content
      await precacheContent(data);
      
    } catch (error) {
      console.error('Failed to load content data:', error);
    } finally {
      setLoading(false);
    }
  };

  const precacheContent = async (data: Grade4Content) => {
    const contentToCache = data.subjects
      .flatMap(subject => subject.topics)
      .flatMap(topic => topic.content)
      .filter(item => item.type === 'image' && item.source === 'Wikimedia Commons');

    for (const item of contentToCache.slice(0, 5)) { // Cache first 5 images
      try {
        const response = await axios.get(item.link, { responseType: 'blob' });
        const blob = response.data;
        await localforage.setItem(`cached-${item.link}`, blob);
        console.log(`Cached content: ${item.description}`);
      } catch (error) {
        console.log(`Failed to cache: ${item.description}`, error);
      }
    }
  };

  const getCachedContent = async (url: string) => {
    try {
      const cached = await localforage.getItem<Blob>(`cached-${url}`);
      if (cached) {
        return URL.createObjectURL(cached);
      }
      return url;
    } catch {
      return url;
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'interactive':
        return <Activity className="h-4 w-4" />;
      case 'audio':
        return <Play className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getLicenseBadgeColor = (license: string) => {
    if (license.includes('CC0')) return 'bg-green-100 text-green-800';
    if (license.includes('CC-BY')) return 'bg-blue-100 text-blue-800';
    if (license.includes('Free')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const renderContentItem = (item: ContentItem, index: number) => (
    <Card key={index} className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getContentIcon(item.type)}
            <Badge variant="outline" className={getLicenseBadgeColor(item.license)}>
              {item.license}
            </Badge>
            <Badge variant="secondary">{item.source}</Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(item.link, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
        </div>
        
        <p className="text-sm text-gray-700 mb-3">{item.description}</p>
        
        {/* Render content based on type */}
        {item.type === 'image' && (
          <div className="mb-3">
            <img 
              src={item.link}
              alt={item.description}
              className="max-w-full h-auto rounded-lg border"
              loading="lazy"
              onError={(e) => {
                // Fallback for broken images
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {item.type === 'video' && (
          <div className="mb-3">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <Video className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Video content available at source</p>
              <Button 
                className="mt-2" 
                onClick={() => window.open(item.link, '_blank')}
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Video
              </Button>
            </div>
          </div>
        )}
        
        {item.type === 'interactive' && (
          <div className="mb-3">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Activity className="h-12 w-12 mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-gray-700">Interactive content available at source</p>
              <Button 
                className="mt-2"
                onClick={() => window.open(item.link, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Try Interactive
              </Button>
            </div>
          </div>
        )}
        
        {item.type === 'audio' && (
          <div className="mb-3">
            <ReactAudioPlayer
              src={item.link}
              controls
              className="w-full"
              onError={() => console.log('Audio failed to load')}
            />
          </div>
        )}
        
        {onContentSelect && (
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => onContentSelect(item)}
          >
            Use in Workspace
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const renderTopicContent = (topic: Topic) => (
    <div key={topic.topic} className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{topic.topic}</h3>
      <div className="space-y-4">
        {topic.content.map((item, index) => renderContentItem(item, index))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full mx-auto mb-4"></div>
          <p>Loading multimedia content...</p>
        </div>
      </Card>
    );
  }

  if (!contentData) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Failed to load content data. Please try again.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <BookOpen className="mr-2 text-blue-600" />
            Grade 4 Multimedia Learning Content
          </CardTitle>
          <p className="text-gray-600">
            Interactive educational resources from Khan Academy, PBS LearningMedia, and other trusted sources
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {contentData.subjects.map((subject) => (
            <TabsTrigger key={subject.subject} value={subject.subject}>
              {subject.subject}
            </TabsTrigger>
          ))}
        </TabsList>

        {contentData.subjects.map((subject) => (
          <TabsContent key={subject.subject} value={subject.subject} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{subject.subject} Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subject.topics.map(renderTopicContent)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Attribution Footer */}
      <Card className="mt-8 bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2">Content Attribution</h4>
          <p className="text-sm text-gray-600">
            Content sourced from Khan Academy, PBS LearningMedia, Wikimedia Commons, 
            CK-12, and other educational providers. All content used in compliance with 
            respective licenses and terms of service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentViewer;