import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, ArrowRight, Menu, ChevronDown, Sun, Moon, Activity } from 'lucide-react';

interface NavbarHeroProps {
  brandName?: string;
  heroTitle?: string;
  heroDescription?: string;
  backgroundImage?: string;
  videoUrl?: string;
}

const NavbarHero: React.FC<NavbarHeroProps> = ({
  brandName = "Watchly",
  heroTitle = "Stop Guessing. Monitor Everything.",
  heroDescription = "The developer platform for real-time uptime monitoring, CI/CD pipeline tracking, and instant alerts. Build with confidence.",
  backgroundImage = "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80",
  videoUrl,
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
      setIsVideoPaused(false);
    }
  };

  const handlePauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsVideoPaused(true);
    }
  };

  const handleResumeVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPaused(false);
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    setIsVideoPaused(false);
  };

  const ThemeToggleButton = () => {
    if (!mounted) return <div className="w-10 h-10" />;
    return (
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="bg-muted hover:bg-border flex-shrink-0 p-2.5 rounded-full transition-colors"
        aria-label="Toggle theme"
      >
        {resolvedTheme === 'light'
          ? <Moon className="h-5 w-5 text-foreground" />
          : <Sun className="h-5 w-5 text-foreground" />}
      </button>
    );
  };

  return (
    <div className="relative w-full bg-background">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">

        {/* ── Navbar ─────────────────────────────── */}
        <div className="py-5 relative z-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="font-bold text-2xl text-foreground flex items-center gap-2 flex-shrink-0"
            >
              <div className="w-7 h-7 rounded-md bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                <Activity className="h-4 w-4 text-green-500" />
              </div>
              {brandName}
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex text-muted-foreground font-medium">
              <ul className="flex items-center space-x-1">
                <li>
                  <button
                    onClick={() => scrollTo('features')}
                    className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('pricing')}
                    className="hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg"
                  >
                    Pricing
                  </button>
                </li>
                <li className="relative">
                  <button
                    onClick={() => toggleDropdown('docs')}
                    className="flex items-center hover:text-foreground px-3 py-2 text-sm transition-colors rounded-lg"
                  >
                    Resources
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${openDropdown === 'docs' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'docs' && (
                    <ul className="absolute top-full left-0 mt-2 p-2 bg-card border border-border shadow-lg rounded-xl z-20 w-44">
                      <li>
                        <button
                          onClick={() => navigate('/docs')}
                          className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                        >
                          Documentation
                        </button>
                      </li>
                      <li>
                        <a
                          href="https://github.com/RickMelendez/watchly"
                          target="_blank"
                          rel="noreferrer"
                          className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                        >
                          GitHub
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-foreground hover:text-muted-foreground py-2 px-4 text-sm font-medium transition-colors rounded-xl"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-green-500 hover:bg-green-400 text-black py-2.5 px-5 text-sm rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <ThemeToggleButton />

            {/* Mobile menu */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-transparent hover:bg-muted border-none p-2 rounded-xl transition-colors text-foreground"
              >
                <Menu className="h-6 w-6" />
              </button>
              {isMobileMenuOpen && (
                <ul className="absolute top-full right-0 mt-2 p-2 shadow-lg bg-card border border-border rounded-xl w-56 z-30">
                  <li>
                    <button
                      onClick={() => scrollTo('features')}
                      className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollTo('pricing')}
                      className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
                    >
                      Pricing
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => navigate('/docs')}
                      className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
                    >
                      Documentation
                    </button>
                  </li>
                  <li className="border-t border-border mt-2 pt-2 space-y-2">
                    <button
                      onClick={() => navigate('/login')}
                      className="block w-full text-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-green-500 hover:bg-green-400 text-black px-3 py-2.5 text-sm rounded-lg flex items-center justify-center gap-2 font-semibold"
                    >
                      Get Started <ArrowRight className="h-4 w-4" />
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ── Hero ───────────────────────────────── */}
        <div className="pt-6 pb-10 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Now in Public Beta
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-foreground font-black tracking-tighter leading-[1.05]">
              {heroTitle}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {heroDescription}
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={() => navigate('/login')}
                className="bg-green-500 hover:bg-green-400 text-black px-7 py-3.5 rounded-lg font-bold text-base transition-colors duration-200 flex items-center gap-2"
              >
                Start Monitoring Free
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/docs')}
                className="px-7 py-3.5 rounded-lg font-semibold text-base border border-border text-muted-foreground hover:text-foreground hover:border-border/60 transition-colors"
              >
                View Docs
              </button>
            </div>
            <div className="mt-5 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Free forever plan
              </span>
            </div>
          </div>
        </div>

        {/* ── Media ──────────────────────────────── */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border/40 shadow-2xl">
          <img
            src={backgroundImage}
            alt="Watchly monitoring dashboard"
            className={`w-full h-full absolute inset-0 object-cover transition-opacity duration-500 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
          />
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              className={`w-full h-full absolute inset-0 object-cover transition-opacity duration-500 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'}`}
              onEnded={handleVideoEnded}
              playsInline
              muted
            />
          )}
          {/* Overlay gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {videoUrl && (
            <div className="absolute bottom-5 right-5 z-10">
              {!isVideoPlaying ? (
                <button
                  onClick={handlePlayVideo}
                  className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200 shadow-lg"
                >
                  <Play className="h-7 w-7 text-white fill-white ml-1" />
                </button>
              ) : (
                <button
                  onClick={isVideoPaused ? handleResumeVideo : handlePauseVideo}
                  className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-200 shadow-lg"
                >
                  {isVideoPaused
                    ? <Play className="h-7 w-7 text-white fill-white ml-1" />
                    : <Pause className="h-7 w-7 text-white fill-white" />}
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export { NavbarHero };
