import EnhancedWorkspace from "@/components/EnhancedWorkspace";
import { NavigationHeader } from "@/components/ui/navigation-header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";

export default function WorkspacePage() {
  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      <NavigationHeader 
        title="Student Workspace"
        progress={0}
      />
      
      <div className="py-6">
        <EnhancedWorkspace mode="assignment" />
      </div>

      <BottomNavigation />
    </div>
  );
}