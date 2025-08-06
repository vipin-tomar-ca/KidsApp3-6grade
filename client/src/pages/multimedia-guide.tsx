import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Link } from "wouter";
import { 
  BookOpen, 
  FileText, 
  Palette, 
  Music, 
  Video, 
  Image,
  Activity,
  Trophy,
  ArrowRight
} from 'lucide-react';

const MultimediaGuide = () => {
  const features = [
    {
      title: "Learning Content Library",
      description: "Browse Grade 4 multimedia content from Khan Academy, PBS LearningMedia, and more",
      icon: <BookOpen className="h-6 w-6" />,
      path: "/content-browser",
      badge: "New",
      color: "bg-blue-100 text-blue-800",
      items: [
        "Interactive videos and lessons",
        "Educational images and diagrams", 
        "Quizzes and interactive activities",
        "Content from trusted educational sources"
      ]
    },
    {
      title: "Enhanced Student Workspace",
      description: "Digital workspace with text editing, math equations, and drawing tools",
      icon: <FileText className="h-6 w-6" />,
      path: "/workspace",
      badge: "Enhanced",
      color: "bg-green-100 text-green-800",
      items: [
        "Rich text editor for writing",
        "Math equation support with LaTeX",
        "Digital drawing canvas",
        "Academic integrity monitoring"
      ]
    },
    {
      title: "Creative Activities Studio", 
      description: "Music and art activities inspired by educational content creators",
      icon: <Palette className="h-6 w-6" />,
      path: "/creative",
      badge: "Interactive",
      color: "bg-purple-100 text-purple-800",
      items: [
        "Music rhythm games and activities",
        "Digital art studio with tutorials",
        "Step-by-step drawing guides",
        "Creative project saving"
      ]
    },
    {
      title: "Olympiad Preparation",
      description: "Competition-style problems for Math and Science Olympiad practice",
      icon: <Trophy className="h-6 w-6" />,
      path: "/workspace",
      badge: "Challenge",
      color: "bg-orange-100 text-orange-800",
      items: [
        "AMC 8 style math problems",
        "Science Olympiad practice questions",
        "Timed challenges",
        "Immediate feedback and explanations"
      ]
    }
  ];

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      <NavigationHeader 
        title="Multimedia Features Guide"
        progress={0}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Video className="h-8 w-8" />
              <Image className="h-8 w-8" />
              <Activity className="h-8 w-8" />
              <Music className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Grade 4 Multimedia Learning Platform</h2>
            <p className="text-blue-100">
              Interactive educational content from Khan Academy, PBS LearningMedia, Wikimedia Commons, 
              and other trusted educational providers - all integrated into your learning experience!
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge className={feature.color}>{feature.badge}</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-4">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href={feature.path}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Try It Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Buttons */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <p className="text-gray-600">Jump directly to any feature</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href="/content-browser">
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Content
                </Button>
              </Link>
              <Link href="/workspace">
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Workspace
                </Button>
              </Link>
              <Link href="/creative">
                <Button variant="outline" className="w-full">
                  <Palette className="h-4 w-4 mr-2" />
                  Creative
                </Button>
              </Link>
              <Link href="/olympiad">
                <Button variant="outline" className="w-full">
                  <Trophy className="h-4 w-4 mr-2" />
                  Olympiad
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Content Sources */}
        <Card className="mt-6 bg-gray-50">
          <CardHeader>
            <CardTitle>Educational Content Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Khan Academy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>PBS LearningMedia</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Wikimedia Commons</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>CK-12</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Art for Kids Hub</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Free Music Archive</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              All content is used in compliance with respective licenses and educational use terms.
              Content is filtered for age-appropriateness and COPPA compliance.
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MultimediaGuide;