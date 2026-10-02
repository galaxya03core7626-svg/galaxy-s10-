import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { AdCampaign } from '../types';
import { soundManager } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  ExternalLink,
  Shuffle,
  ShieldCheck,
  DollarSign,
  Sparkles,
} from 'lucide-react';

export const AdVideoPlayer: React.FC = () => {
  const { ads, recordAdViewEarnings, addRandomAd, availableBalance } = useApp();

  const [selectedAdIndex, setSelectedAdIndex] = useState<number>(0);
  const currentAd: AdCampaign = ads[selectedAdIndex] || ads[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const posterImgRef = useRef<HTMLImageElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isTabFocused, setIsTabFocused] = useState<boolean>(true);
  const [playbackComplete, setPlaybackComplete] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);
  const [earnedAmount, setEarnedAmount] = useState<number>(0);

  const requiredSeconds = currentAd.durationSeconds || 15;

  // Preload poster image for smooth canvas rendering
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentAd.posterUrl;
    img.onload = () => {
      posterImgRef.current = img;
      renderFrame(currentTime, false);
    };
    posterImgRef.current = img;
  }, [currentAd.posterUrl]);

  // Tab visibility detection to prevent background tab farming
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabFocused(false);
        setIsPlaying(false);
        soundManager.stopAmbientAudio();
      } else {
        setIsTabFocused(true);
      }
    };

    const handleWindowBlur = () => {
      setIsTabFocused(false);
      setIsPlaying(false);
      soundManager.stopAmbientAudio();
    };

    const handleWindowFocus = () => {
      setIsTabFocused(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      soundManager.stopAmbientAudio();
    };
  }, []);

  // Frame renderer for broadcast-grade canvas video
  const renderFrame = useCallback((time: number, playing: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Poster Background with subtle cinematic Ken Burns effect
    const img = posterImgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      const progressRatio = time / requiredSeconds;
      const zoom = 1.0 + progressRatio * 0.08;
      const panX = Math.sin(progressRatio * Math.PI) * 20;

      ctx.translate(width / 2 + panX, height / 2);
      ctx.scale(zoom, zoom);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();
    } else {
      // Elegant dark gradient fallback
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Cinematic Vignette & Ambient Darkness Overlay
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.2,
      width / 2,
      height / 2,
      width * 0.7
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0.15)');
    vignette.addColorStop(1, 'rgba(2, 6, 23, 0.85)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // 3. Audio Frequency Waveform Visualizer (animates while playing)
    if (playing) {
      const bars = 24;
      const barWidth = 4;
      const spacing = 4;
      const startX = width - (bars * (barWidth + spacing)) - 40;
      const baseY = height - 85;

      ctx.fillStyle = 'rgba(52, 211, 153, 0.75)'; // Emerald 400
      for (let i = 0; i < bars; i++) {
        const freqOffset = Math.sin(time * 8 + i * 0.4) * 0.5 + 0.5;
        const barHeight = Math.max(4, freqOffset * 22);
        ctx.fillRect(startX + i * (barWidth + spacing), baseY - barHeight, barWidth, barHeight);
      }
    }

    // 4. Commercial Lower-Third Banner
    ctx.save();
    ctx.fillStyle = 'rgba(2, 6, 23, 0.80)';
    ctx.fillRect(30, height - 120, width * 0.55, 60);
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, height - 120, width * 0.55, 60);

    // Tagline / Subtitle in banner
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(`OFFICIAL COMMERCIAL BROADCAST · ${currentAd.category.toUpperCase()}`, 45, height - 98);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(currentAd.title, 45, height - 76);
    ctx.restore();

    // 5. HD Broadcast Watermark (Top Right)
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('LIVE HD 1080p 60FPS · SPONSORED STREAM', width - 35, 45);

    // Verified indicator dot
    ctx.beginPath();
    ctx.arc(width - 250, 41, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.restore();
  }, [currentAd, requiredSeconds]);

  // Main animation / playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderFrame(currentTime, false);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (timestamp: number) => {
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= requiredSeconds) {
          setIsPlaying(false);
          setPlaybackComplete(true);
          soundManager.stopAmbientAudio();
          soundManager.playRewardChime();
          renderFrame(requiredSeconds, false);
          return requiredSeconds;
        }
        renderFrame(next, true);
        return next;
      });

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, requiredSeconds, renderFrame]);

  // Handle switching ad campaign
  const switchAd = (index: number) => {
    setSelectedAdIndex(index);
    setCurrentTime(0);
    setIsPlaying(false);
    setPlaybackComplete(false);
    setSelectedOption(null);
    setVerificationError(null);
    setClaimSuccess(false);
    soundManager.stopAmbientAudio();
  };

  const togglePlay = () => {
    if (playbackComplete) {
      restartVideo();
      return;
    }
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      soundManager.startAmbientAudio(isMuted);
    } else {
      soundManager.stopAmbientAudio();
    }
  };

  const restartVideo = () => {
    setCurrentTime(0);
    setPlaybackComplete(false);
    setSelectedOption(null);
    setVerificationError(null);
    setClaimSuccess(false);
    setIsPlaying(true);
    soundManager.startAmbientAudio(isMuted);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (isPlaying) {
      if (nextMuted) {
        soundManager.stopAmbientAudio();
      } else {
        soundManager.startAmbientAudio(false);
      }
    }
  };

  const handleVerificationSubmit = () => {
    if (!selectedOption) {
      setVerificationError('Please select an answer to verify your viewership.');
      return;
    }

    if (selectedOption === currentAd.verificationQuestion.correctOption) {
      recordAdViewEarnings(currentAd);
      setEarnedAmount(currentAd.rewardUSD);
      setClaimSuccess(true);
      setVerificationError(null);
      soundManager.playRewardChime();
    } else {
      setVerificationError('Incorrect answer. Please re-check the sponsor details and try again.');
    }
  };

  const handleNextRandomAd = () => {
    addRandomAd();
    setTimeout(() => {
      setSelectedAdIndex(0);
      restartVideo();
    }, 100);
  };

  const remainingSeconds = Math.max(0, Math.ceil(requiredSeconds - currentTime));
  const progressRatio = Math.min(100, (currentTime / requiredSeconds) * 100);

  return (
    <div className="space-y-6">
      {/* Header section with live economics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Watch Verified Sponsor Ads & Earn</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
              Live Advertiser CPM Pool
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real advertiser campaigns pay verified viewers. Watch the complete duration without switching tabs to unlock instant dollar rewards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNextRandomAd}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3.5 py-2 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Discover Random Ad</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport & Verification Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Canvas-Based Commercial Broadcaster */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl group select-none">
            {/* High-Definition 1080p Canvas Commercial Engine */}
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Inactive Tab Anti-Bot Warning Overlay */}
            {!isTabFocused && isPlaying && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
                <AlertTriangle className="w-12 h-12 text-amber-400 mb-3 animate-pulse" />
                <h3 className="text-lg font-bold text-white mb-1">Playback Paused: Active Window Required</h3>
                <p className="text-sm text-slate-300 max-w-md">
                  To prevent fraudulent background bot farming and ensure genuine advertiser value, the video pauses when you switch tabs. Please focus this tab to continue earning.
                </p>
              </div>
            )}

            {/* Top Bar inside Video: Sponsor badge and Live Net Earning */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
              <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{currentAd.sponsor}</span>
              </div>

              <div className="bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 font-mono tabular-nums flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>+${currentAd.rewardUSD.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Center Play Button Overlay when paused */}
            {!isPlaying && !playbackComplete && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10 hover:bg-black/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 pl-1 hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 fill-slate-950" />
                </div>
              </div>
            )}

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 flex flex-col gap-2 z-20">
              {/* Progress bar */}
              <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden relative cursor-default">
                <div
                  className="h-full bg-emerald-400 transition-all duration-100 rounded-full"
                  style={{ width: `${progressRatio}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 hover:text-white transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 text-emerald-400" /> : <Play className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={restartVideo}
                    className="p-1.5 hover:text-white transition-colors cursor-pointer"
                    title="Replay from start"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-1.5 hover:text-white transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                  </button>

                  <div className="font-mono tabular-nums text-slate-300 text-xs font-semibold">
                    {currentTime.toFixed(1)}s / {requiredSeconds.toFixed(1)}s
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {playbackComplete ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      Verification Unlocked
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono">
                      {remainingSeconds}s remaining for reward
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ad details and Sponsor Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">{currentAd.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{currentAd.tagline}</p>
              </div>

              <a
                href={currentAd.sponsorUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium shrink-0 pt-1"
              >
                <span>Visit Sponsor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500">Gross Advertiser Bid: </span>
                <span className="font-mono font-medium text-slate-300">${currentAd.grossCPM.toFixed(2)} CPM</span>
              </div>
              <span className="text-slate-700">·</span>
              <div>
                <span className="text-slate-500">User Share (75%): </span>
                <span className="font-mono font-semibold text-emerald-400">+${currentAd.rewardUSD.toFixed(2)}</span>
              </div>
              <span className="text-slate-700">·</span>
              <div>
                <span className="text-slate-500">Category: </span>
                <span className="text-slate-300">{currentAd.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Attention Verification & Reward Claim Panel */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Attention Verification</h4>
                <p className="text-[11px] text-slate-400">Guarantees real human viewership for advertisers</p>
              </div>
            </div>

            {!playbackComplete && !claimSuccess && (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400 font-mono text-sm">
                  {remainingSeconds}s
                </div>
                <h5 className="text-sm font-semibold text-white">Watch Video to Unlock Reward</h5>
                <p className="text-xs text-slate-400 px-4">
                  The verification challenge will appear once the {requiredSeconds}-second sponsor video finishes playing.
                </p>

                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="mt-2 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Start Watching Now</span>
                  </button>
                )}
              </div>
            )}

            {playbackComplete && !claimSuccess && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Playback duration verified! Answer the question to claim.</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">
                    {currentAd.verificationQuestion.question}
                  </label>

                  <div className="space-y-2 pt-1">
                    {currentAd.verificationQuestion.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedOption(opt);
                          setVerificationError(null);
                        }}
                        className={`w-full text-left p-3 rounded-lg text-xs transition-colors cursor-pointer border ${
                          selectedOption === opt
                            ? 'bg-emerald-500/20 border-emerald-500 text-white font-medium'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {verificationError && (
                  <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}

                <button
                  onClick={handleVerificationSubmit}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Claim +${currentAd.rewardUSD.toFixed(2)} Real Dollars</span>
                </button>
              </div>
            )}

            {claimSuccess && (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-white">Dollars Credited!</h5>
                  <p className="font-mono text-2xl font-black text-emerald-400 mt-1 tabular-nums">
                    +${earnedAmount.toFixed(2)} USD
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Audited ledger entry recorded with cryptographic hash. New available balance:{' '}
                    <strong className="text-white font-mono">${availableBalance.toFixed(2)}</strong>
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleNextRandomAd}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Watch Next Random Ad (+$$)</span>
                  </button>
                  <button
                    onClick={restartVideo}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    Replay Current Ad
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Ad Queue / Carousel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Available Ad Campaigns ({ads.length})</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {ads.map((ad, idx) => (
                <button
                  key={ad.id}
                  onClick={() => switchAd(idx)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-between border ${
                    selectedAdIndex === idx
                      ? 'bg-slate-800 border-emerald-500/50 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold truncate">{ad.title}</p>
                    <p className="text-[11px] text-slate-500">{ad.durationSeconds}s · {ad.sponsor}</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 shrink-0">
                    +${ad.rewardUSD.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
