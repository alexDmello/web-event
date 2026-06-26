import React, { useEffect, useState, useRef } from 'react';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const removeInteractionListenersRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Instantiate global background audio
    const audio = new Audio('/assets/audio/final audio.mp3');
    audio.loop = true;
    audio.currentTime = 0; // Force replay from start on reload
    audioRef.current = audio;

    // Helper function to attempt autoplay on user interaction
    const startPlay = (e?: Event) => {
      // Ignore click/touchstart events originating from the sound-toggle button
      if (e && e.target && e.target instanceof Element && e.target.closest('#sound-toggle')) {
        return;
      }
      
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            if (removeInteractionListenersRef.current) {
              removeInteractionListenersRef.current();
            }
          })
          .catch((err) => {
            // Autoplay blocked by browser policy, waiting for next interaction
            console.log("Autoplay waiting for user interaction:", err.message);
          });
      }
    };

    const removeInteractionListeners = () => {
      window.removeEventListener('click', startPlay);
      window.removeEventListener('scroll', startPlay);
      window.removeEventListener('touchstart', startPlay);
    };

    removeInteractionListenersRef.current = removeInteractionListeners;

    // Try playing immediately
    startPlay();

    // Setup fallback listeners for first interaction to bypass autoplay blocks
    window.addEventListener('click', startPlay);
    window.addEventListener('scroll', startPlay, { passive: true });
    window.addEventListener('touchstart', startPlay, { passive: true });

    return () => {
      audio.pause();
      removeInteractionListeners();
    };
  }, []);

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent bubbling to window event listener
    }
    
    // Explicitly clean up interaction listeners once user takes manual control
    if (removeInteractionListenersRef.current) {
      removeInteractionListenersRef.current();
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error("Audio playback failed", err);
          });
      }
    }
  };

  return (
    <header className="site-header scrolled">
      <div className="header-controls">
        {/* Hamburger toggle menu */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
        >
          <span className="menu-line"></span>
          <span className="menu-line menu-line-short"></span>
          <span className="menu-line"></span>
        </button>

        {/* Global Sound Control (Speaker/Mute) */}
        <button 
          className="sound-toggle" 
          id="sound-toggle" 
          onClick={toggleSound}
          aria-label={isPlaying ? "Mute Background Music" : "Unmute Background Music"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
              <path d="M21.12 9.88a.75.75 0 0 0-1.06 0L18 11.94l-2.06-2.06a.75.75 0 0 0-1.06 1.06L16.94 13l-2.06 2.06a.75.75 0 0 0 1.06 1.06L18 14.06l2.06 2.06a.75.75 0 0 0 1.06-1.06L19.06 13l2.06-2.06a.75.75 0 0 0 0-1.06z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};
