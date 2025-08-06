import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccessibilityToolbar, SpeakableText } from "@/components/ui/accessibility";
import { Music, ArrowLeft, Play, Trophy, Clock, Volume2, Mic, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button as BootstrapButton } from "react-bootstrap";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MusicPage() {
  const navigate = useNavigate();
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const musicActivities = [
    {
      id: 1,
      title: "Sing-Along Songs",
      description: "Learn classic children's songs with lyrics",
      type: "singing",
      difficulty: 1,
      points: 15,
      duration: 5,
      completed: true,
      icon: "🎤",
      tracks: ["Twinkle Twinkle Little Star", "Old MacDonald", "If You're Happy"]
    },
    {
      id: 2,
      title: "Rhythm Games",
      description: "Clap, tap, and move to the beat",
      type: "rhythm",
      difficulty: 2,
      points: 20,
      duration: 10,
      completed: true,
      icon: "🥁",
      tracks: ["Simple Beats", "Animal Sounds", "Kitchen Band"]
    },
    {
      id: 3,
      title: "Instrument Explorer",
      description: "Learn about different musical instruments",
      type: "learning",
      difficulty: 2,
      points: 25,
      duration: 8,
      completed: false,
      icon: "🎹",
      tracks: ["Piano Sounds", "String Family", "Wind Instruments"]
    },
    {
      id: 4,
      title: "Musical Stories",
      description: "Stories told through music and songs",
      type: "story",
      difficulty: 1,
      points: 18,
      duration: 12,
      completed: false,
      icon: "🎭",
      tracks: ["Peter & The Wolf", "The Sound of Music", "Musical Animals"]
    }
  ];

  const featuredSongs = [
    { title: "ABC Song", duration: "2:30", difficulty: "Easy", emoji: "🅰️" },
    { title: "Five Little Ducks", duration: "3:15", difficulty: "Easy", emoji: "🦆" },
    { title: "The Wheels on the Bus", duration: "2:45", difficulty: "Medium", emoji: "🚌" },
    { title: "Bingo", duration: "2:00", difficulty: "Easy", emoji: "🐕" }
  ];

  const instruments = [
    { name: "Piano", emoji: "🎹", sound: "Ding!" },
    { name: "Guitar", emoji: "🎸", sound: "Strum!" },
    { name: "Drums", emoji: "🥁", sound: "Boom!" },
    { name: "Violin", emoji: "🎻", sound: "La!" },
    { name: "Trumpet", emoji: "🎺", sound: "Toot!" },
    { name: "Flute", emoji: "🪈", sound: "Whistle!" }
  ];

  const playTrack = (trackId: string) => {
    setPlayingTrack(trackId);
    // Simulate playing for 2 seconds
    setTimeout(() => setPlayingTrack(null), 2000);
  };

  return (
    <div className="bg-kid-gradient min-h-screen pb-20">
      <AccessibilityToolbar />
      
      <Container fluid className="py-4">
        {/* Header */}
        <header className="bg-white shadow-lg rounded-4 p-4 mb-4">
          <div className="max-w-md mx-auto">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <button 
                  onClick={() => navigate('/subjects')}
                  className="btn btn-light rounded-circle me-3 p-2"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="bg-gradient-to-r from-pink-500 to-pink-700 rounded-3 p-3 me-3 animate-pulse-slow">
                  <Music className="text-white" size={24} />
                </div>
                <h1 className="h2 fw-bold text-dark mb-0">Music Studio</h1>
              </div>
              <div className="d-flex align-items-center">
                <Trophy className="text-warning me-2" size={20} />
                <span className="h5 fw-bold text-dark mb-0">65%</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-3">
          {/* Welcome Message */}
          <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-pink-50 to-purple-100">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="display-1 mb-3">🎵</div>
                <SpeakableText text="Welcome to Music Studio! Let's make beautiful music together and explore the wonderful world of sounds and rhythm.">
                  <h2 className="h3 fw-bold text-dark mb-2">Welcome to Music Studio!</h2>
                  <p className="text-muted">Let's make beautiful music together!</p>
                </SpeakableText>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card className="rounded-4 shadow-lg mb-4">
            <CardHeader>
              <CardTitle className="d-flex align-items-center h5">
                <Music className="me-2 text-primary" size={20} />
                Your Musical Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Row className="g-3 text-center">
                <Col xs={4}>
                  <div className="bg-pink-50 rounded-3 p-3">
                    <div className="h4 fw-bold text-primary">8</div>
                    <div className="small text-muted">Songs Learned</div>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="bg-purple-50 rounded-3 p-3">
                    <div className="h4 fw-bold text-success">120</div>
                    <div className="small text-muted">Points</div>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="bg-orange-50 rounded-3 p-3">
                    <div className="h4 fw-bold text-warning">5</div>
                    <div className="small text-muted">Instruments</div>
                  </div>
                </Col>
              </Row>
            </CardContent>
          </Card>

          {/* Featured Song */}
          <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-blue-500 to-purple-600">
            <CardContent className="pt-4 text-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="h5 fw-bold mb-2 d-flex align-items-center">
                    🌟 Song of the Day
                  </h3>
                  <p className="h6 mb-1">Rainbow Connection</p>
                  <p className="text-light small mb-3">
                    A beautiful song about dreams and friendship
                  </p>
                  <BootstrapButton 
                    className="btn-light text-primary fw-bold py-2 px-3 rounded-3"
                    onClick={() => playTrack('rainbow-connection')}
                  >
                    <Play className="me-2" size={16} />
                    {playingTrack === 'rainbow-connection' ? 'Playing...' : 'Listen Now'} 🎼
                  </BootstrapButton>
                </div>
                <div className="display-4">🌈</div>
              </div>
            </CardContent>
          </Card>

          {/* Music Activities */}
          <section className="mb-4">
            <SpeakableText text="Choose a music activity to explore singing, rhythm, instruments, or musical stories">
              <h3 className="h4 fw-bold text-dark mb-3">Choose Your Musical Adventure</h3>
            </SpeakableText>
            
            <div className="d-flex flex-column gap-3">
              {musicActivities.map((activity) => (
                <Card 
                  key={activity.id} 
                  className={cn(
                    "rounded-4 shadow-lg cursor-pointer transition-all",
                    activity.completed ? "bg-pink-50 border-pink-200" : "bg-white"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="d-flex align-items-start flex-fill">
                        <div className="display-6 me-3">{activity.icon}</div>
                        <div className="flex-fill">
                          <SpeakableText text={`${activity.title}: ${activity.description}`}>
                            <h4 className="h6 fw-bold text-dark mb-1">
                              {activity.title}
                            </h4>
                            <p className="text-muted small mb-2">
                              {activity.description}
                            </p>
                          </SpeakableText>
                          
                          <div className="d-flex flex-wrap gap-2 small mb-2">
                            <span className={cn(
                              "badge rounded-pill",
                              activity.type === "singing" ? "bg-pink-100 text-pink-700" :
                              activity.type === "rhythm" ? "bg-orange-100 text-orange-700" :
                              activity.type === "learning" ? "bg-blue-100 text-blue-700" :
                              "bg-purple-100 text-purple-700"
                            )}>
                              {activity.type === "singing" ? "🎤 Singing" :
                               activity.type === "rhythm" ? "🥁 Rhythm" :
                               activity.type === "learning" ? "📚 Learning" : "🎭 Story"}
                            </span>
                            <span className="d-flex align-items-center text-muted">
                              <Clock size={12} className="me-1" />
                              {activity.duration} min
                            </span>
                            <span className="text-success fw-bold">
                              +{activity.points} points
                            </span>
                          </div>
                          
                          <div className="small text-muted">
                            <span className="fw-bold">Featured tracks:</span>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {activity.tracks.slice(0, 2).map((track, index) => (
                                <span key={index} className="badge bg-light text-dark">
                                  {track}
                                </span>
                              ))}
                              {activity.tracks.length > 2 && (
                                <span className="badge bg-light text-muted">
                                  +{activity.tracks.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex flex-column align-items-center ms-3">
                        {activity.completed ? (
                          <div className="btn btn-success rounded-circle p-2">
                            <Trophy className="text-white" size={20} />
                          </div>
                        ) : (
                          <BootstrapButton 
                            className="btn-primary rounded-circle p-2"
                            onClick={() => playTrack(`activity-${activity.id}`)}
                          >
                            <Play className="text-white" size={20} />
                          </BootstrapButton>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Virtual Instrument Panel */}
          <Card className="rounded-4 shadow-lg mb-4">
            <CardHeader>
              <CardTitle className="d-flex align-items-center h5">
                <Headphones className="me-2 text-warning" size={20} />
                Virtual Instruments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpeakableText text="Tap on instruments to hear their sounds and learn about different musical families">
                <p className="text-muted mb-3">Tap to hear each instrument!</p>
              </SpeakableText>
              
              <Row className="g-2">
                {instruments.map((instrument, index) => (
                  <Col key={index} xs={4}>
                    <BootstrapButton 
                      className="w-100 btn-outline-primary rounded-3 p-3 d-flex flex-column align-items-center"
                      onClick={() => playTrack(`instrument-${index}`)}
                    >
                      <div className="display-6 mb-1">{instrument.emoji}</div>
                      <span className="small fw-bold">{instrument.name}</span>
                      {playingTrack === `instrument-${index}` && (
                        <span className="text-success small">{instrument.sound}</span>
                      )}
                    </BootstrapButton>
                  </Col>
                ))}
              </Row>
            </CardContent>
          </Card>

          {/* Featured Songs List */}
          <Card className="rounded-4 shadow-lg mb-4">
            <CardHeader>
              <CardTitle className="d-flex align-items-center h5">
                <Mic className="me-2 text-info" size={20} />
                Popular Songs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="d-flex flex-column gap-2">
                {featuredSongs.map((song, index) => (
                  <div key={index} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                    <div className="d-flex align-items-center">
                      <span className="display-6 me-3">{song.emoji}</span>
                      <div>
                        <SpeakableText text={`${song.title}, duration ${song.duration}, difficulty ${song.difficulty}`}>
                          <h6 className="fw-bold mb-0">{song.title}</h6>
                          <small className="text-muted">{song.duration} • {song.difficulty}</small>
                        </SpeakableText>
                      </div>
                    </div>
                    <BootstrapButton 
                      size="sm"
                      className="btn-outline-primary rounded-circle"
                      onClick={() => playTrack(`song-${index}`)}
                    >
                      <Play size={16} />
                    </BootstrapButton>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Music Theory Fun Facts */}
          <Card className="rounded-4 shadow-lg mb-4 bg-gradient-to-r from-green-400 to-blue-500">
            <CardContent className="pt-4 text-white">
              <div className="text-center">
                <div className="display-4 mb-3">🎼</div>
                <SpeakableText text="Music fact: Did you know that music can help you learn better? When you sing or play instruments, you use both sides of your brain at the same time!">
                  <h3 className="h5 fw-bold mb-2">Music Fact!</h3>
                  <p className="text-light mb-3">
                    Did you know that music can help you learn better? 
                    When you sing or play instruments, you use both sides of your brain! 🧠
                  </p>
                </SpeakableText>
                <BootstrapButton className="btn-light text-primary fw-bold py-2 px-3 rounded-3">
                  More Music Facts! 🎵
                </BootstrapButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}