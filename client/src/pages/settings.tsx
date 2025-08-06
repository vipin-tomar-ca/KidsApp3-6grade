import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff, 
  Palette, 
  Shield, 
  User, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Moon,
  Sun
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsGroups = [
    {
      title: "Audio & Visual",
      icon: Volume2,
      settings: [
        {
          id: "sound",
          label: "Sound Effects",
          description: "Play sounds during activities",
          type: "toggle",
          value: soundEnabled,
          onChange: setSoundEnabled,
          icon: soundEnabled ? Volume2 : VolumeX,
        },
        {
          id: "notifications",
          label: "Notifications",
          description: "Get reminders to practice",
          type: "toggle",
          value: notificationsEnabled,
          onChange: setNotificationsEnabled,
          icon: notificationsEnabled ? Bell : BellOff,
        },
        {
          id: "dark-mode",
          label: "Dark Mode",
          description: "Use dark colors for the app",
          type: "toggle",
          value: darkMode,
          onChange: setDarkMode,
          icon: darkMode ? Moon : Sun,
        },
      ]
    },
    {
      title: "Account & Profile",
      icon: User,
      settings: [
        {
          id: "profile",
          label: "Edit Profile",
          description: "Change your name and avatar",
          type: "navigate",
          icon: User,
        },
        {
          id: "privacy",
          label: "Privacy Settings",
          description: "Control what information is shared",
          type: "navigate",
          icon: Shield,
        },
      ]
    },
    {
      title: "Learning",
      icon: Palette,
      settings: [
        {
          id: "difficulty",
          label: "Difficulty Level",
          description: "Adjust how challenging activities are",
          type: "navigate",
          icon: Palette,
        },
        {
          id: "subjects",
          label: "Favorite Subjects",
          description: "Choose which subjects to focus on",
          type: "navigate",
          icon: Palette,
        },
      ]
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      settings: [
        {
          id: "help",
          label: "Help Center",
          description: "Get help with using the app",
          type: "navigate",
          icon: HelpCircle,
        },
        {
          id: "parent-mode",
          label: "Parent Dashboard",
          description: "Switch to parent view",
          type: "navigate",
          icon: Shield,
        },
      ]
    }
  ];

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white shadow-lg rounded-b-3xl p-4 mb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-700 rounded-2xl flex items-center justify-center">
              <SettingsIcon className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4">
        {/* Quick Settings */}
        <Card className="rounded-3xl shadow-lg mb-6 bg-gradient-to-r from-blue-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚙️</div>
              <h2 className="text-xl font-bold text-gray-800">Quick Settings</h2>
              <p className="text-gray-600 text-sm">Adjust your experience</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={cn(
                  "p-3 rounded-2xl transition-all kid-button flex flex-col items-center space-y-2",
                  soundEnabled ? "bg-kid-green text-white" : "bg-white text-gray-600"
                )}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                <span className="text-xs font-semibold">Sound</span>
              </button>
              
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={cn(
                  "p-3 rounded-2xl transition-all kid-button flex flex-col items-center space-y-2",
                  notificationsEnabled ? "bg-kid-blue text-white" : "bg-white text-gray-600"
                )}
              >
                {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                <span className="text-xs font-semibold">Alerts</span>
              </button>
              
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={cn(
                  "p-3 rounded-2xl transition-all kid-button flex flex-col items-center space-y-2",
                  darkMode ? "bg-kid-purple text-white" : "bg-white text-gray-600"
                )}
              >
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                <span className="text-xs font-semibold">Theme</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <Card key={group.title} className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <group.icon className="mr-2 text-kid-blue" size={20} />
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.settings.map((setting, index) => (
                    <div key={setting.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <setting.icon size={16} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{setting.label}</h3>
                            <p className="text-sm text-gray-600">{setting.description}</p>
                          </div>
                        </div>
                        
                        {setting.type === "toggle" && (
                          <Switch 
                            checked={setting.value as boolean}
                            onCheckedChange={setting.onChange}
                          />
                        )}
                        
                        {setting.type === "navigate" && (
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ChevronRight size={20} className="text-gray-400" />
                          </button>
                        )}
                      </div>
                      
                      {index < group.settings.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Parent Controls */}
        <Card className="rounded-3xl shadow-lg mt-6 mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-dashed border-orange-300">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Parent Controls</h3>
              <p className="text-sm text-gray-600 mb-4">
                Parents can access detailed progress reports and adjust safety settings
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-2xl kid-button">
                Enter Parent Mode
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="rounded-3xl shadow-lg mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4">KidLearn App</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Version 1.0.0</p>
                <p>Made with ❤️ for young learners</p>
              </div>
              <div className="mt-6 space-y-3">
                <Button variant="outline" className="w-full rounded-2xl">
                  Privacy Policy
                </Button>
                <Button variant="outline" className="w-full rounded-2xl">
                  Terms of Service
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full rounded-2xl flex items-center justify-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
