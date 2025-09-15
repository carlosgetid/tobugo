import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import userVideo1 from "@assets/230575_small_1757936852080.mp4";
import userVideo2 from "@assets/12584129_1080_1920_60fps_1757937267745.mp4";
import userVideo3 from "@assets/16119043-hd_1080_1920_30fps (1)_1757937270131.mp4";

// User's custom videos
const videoSources = [
  userVideo1,
  userVideo2,
  userVideo3
];

export function VideoHero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Cambiar video cada 7 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoSources.length);
      // No resetear isVideoLoaded para evitar interrupciones visuales
    }, 7000); // Changed from 15000 to 7000 milliseconds

    return () => clearInterval(interval);
  }, [videoSources.length]);

  const handleVideoLoad = () => {
    console.log("Video loaded successfully:", videoSources[currentVideoIndex]);
    setIsVideoLoaded(true);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video failed to load:", videoSources[currentVideoIndex], e);
    // Mantener isVideoLoaded en true para evitar pantallas vacías
  };

  return (
    <section className="relative h-screen overflow-hidden" data-active-video-index={currentVideoIndex}>
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          key={currentVideoIndex}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={handleVideoLoad}
          onError={handleVideoError}
          src={videoSources[currentVideoIndex]}
          data-testid="hero-video"
          data-active-index={currentVideoIndex}
        />
        
        {/* Overlay para mejor legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
            Planifica tu viaje perfecto<br />
            <span className="text-white/90">con IA</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Deja que nuestra inteligencia artificial te ayude a crear itinerarios personalizados, 
            encontrar los mejores precios y conectar con otros viajeros.
          </p>
          <Link href="/chat">
            <Button 
              size="lg" 
              className="bg-white text-primary px-8 py-4 text-lg font-semibold hover:bg-white/95 transition-colors"
              data-testid="button-start-planning"
            >
              Comenzar a Planificar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Video indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {videoSources.map((_, index: number) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentVideoIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => {
              setCurrentVideoIndex(index);
              setIsVideoLoaded(false);
            }}
            data-testid={`video-indicator-${index}`}
          />
        ))}
      </div>
    </section>
  );
}