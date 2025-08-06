import React from 'react';
import { NavigationHeader } from "@/components/ui/navigation-header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import ContentViewer from '@/components/ContentViewer';

export default function ContentBrowser() {
  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Navigation Header */}
      <NavigationHeader 
        title="Learning Library"
        progress={0}
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <ContentViewer />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}