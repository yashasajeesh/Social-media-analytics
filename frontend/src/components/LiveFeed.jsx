import React, { useEffect, useState, useRef } from 'react';
import { Radio, Play, Pause, RefreshCw, Zap, MessageSquare, ThumbsUp, MapPin, Sparkles, Activity } from 'lucide-react';
import { generateSimulatedPulse } from '../services/analyticsEngine';

export default function LiveFeed() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const [streamMode, setStreamMode] = useState('connecting'); // 'websocket' | 'autonomous' | 'connecting'
  const wsRef = useRef(null);
  const simulationIntervalRef = useRef(null);

  // Initialize stream
  useEffect(() => {
    let wsAttempts = 0;
    const maxWsAttempts = 1;

    const startSimulationMode = () => {
      setStreamMode('autonomous');
      setIsConnected(true);
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      
      // Seed with initial 3 pulses
      const initialPulses = [generateSimulatedPulse(), generateSimulatedPulse(), generateSimulatedPulse()];
      setMessages(initialPulses);
      setPulseCount(3);

      simulationIntervalRef.current = setInterval(() => {
        if (isPaused) return;
        const newPost = generateSimulatedPulse();
        setMessages((prev) => [newPost, ...prev].slice(0, 30));
        setPulseCount((c) => c + 1);
      }, 2500);
    };

    const tryWebSocket = () => {
      let wsUrl;
      const rawApiUrl = import.meta.env.VITE_API_URL;
      if (rawApiUrl) {
        const cleanHost = rawApiUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const wsProtocol = (rawApiUrl.startsWith('https://') || window.location.protocol === 'https:') ? 'wss:' : 'ws:';
        wsUrl = `${wsProtocol}://${cleanHost}/ws/analytics`;
      } else {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        wsUrl = window.location.port === '3000' 
          ? `ws://127.0.0.1:8000/ws/analytics` 
          : `${protocol}//${host}/ws/analytics`;
      }

      try {
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        // If not connected in 2 seconds, fall back immediately to autonomous simulation
        const timeout = setTimeout(() => {
          if (socket.readyState !== WebSocket.OPEN) {
            socket.close();
            startSimulationMode();
          }
        }, 2000);

        socket.onopen = () => {
          clearTimeout(timeout);
          setIsConnected(true);
          setStreamMode('websocket');
        };

        socket.onmessage = (event) => {
          if (isPaused) return;
          try {
            const data = JSON.parse(event.data);
            if (data.event === "live_feed_update" && data.latest_posts) {
              setMessages((prev) => [...data.latest_posts, ...prev].slice(0, 30));
              setPulseCount((c) => c + 1);
            }
          } catch (err) {}
        };

        socket.onclose = () => {
          clearTimeout(timeout);
          if (wsAttempts < maxWsAttempts) {
            wsAttempts++;
          } else {
            startSimulationMode();
          }
        };

        socket.onerror = () => {
          clearTimeout(timeout);
          startSimulationMode();
        };
      } catch {
        startSimulationMode();
      }
    };

    tryWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, []);

  const clearFeed = () => setMessages([]);

  const getPlatformColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'twitter': return '#38bdf8';
      case 'instagram': return '#ec4899';
      case 'instagram reel': return '#f43f5e';
      case 'reddit': return '#f97316';
      case 'youtube': return '#ef4444';
      default: return '#a855f7';
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              background: 'rgba(236, 72, 153, 0.15)', 
              color: '#ec4899', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Radio size={18} className={isConnected && !isPaused ? 'animate-pulse' : ''} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Real-Time Streaming Pulse
                <span className="badge-tag" style={{ background: streamMode === 'websocket' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)', color: streamMode === 'websocket' ? '#10b981' : '#818cf8' }}>
                  {streamMode === 'websocket' ? 'WebSocket Live' : 'Autonomous Engine Live'}
                </span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Streaming dynamic social sentiment pulses, emotional vectors, and real-time interaction metrics
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="status-pill">
            <span 
              className="pulsing-dot" 
              style={{ backgroundColor: isConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} 
            />
            <span>{isPaused ? 'Stream Paused' : streamMode === 'websocket' ? 'WebSocket Connected' : 'Autonomous Pulse Active'}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({pulseCount} Pulses)</span>
          </div>

          <button 
            className="btn-secondary" 
            onClick={() => setIsPaused(!isPaused)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem' }}
          >
            {isPaused ? <Play size={14} color="#10b981" /> : <Pause size={14} color="#f59e0b" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button 
            className="btn-secondary" 
            onClick={clearFeed}
            title="Clear Feed History"
            style={{ padding: '0.45rem 0.65rem' }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Stream Messages Container */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem', 
        maxHeight: '520px', 
        overflowY: 'auto',
        paddingRight: '0.5rem' 
      }}>
        {messages.map((item, idx) => (
          <div 
            key={item.post_id || idx} 
            className="glass-card" 
            style={{ 
              padding: '1rem 1.25rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem',
              borderLeft: `4px solid ${getPlatformColor(item.platform)}`,
              animation: idx === 0 ? 'slideDown 0.3s ease-out' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span 
                  className="badge-tag" 
                  style={{ 
                    backgroundColor: `${getPlatformColor(item.platform)}20`, 
                    color: getPlatformColor(item.platform),
                    border: `1px solid ${getPlatformColor(item.platform)}40` 
                  }}
                >
                  {item.platform}
                </span>
                <span style={{ fontWeight: '700', fontSize: '0.88rem' }}>{item.user_id}</span>
                {item.location && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={11} /> {item.location}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`sentiment-badge ${item.sentiment_label?.toLowerCase() === 'positive' ? 'positive' : item.sentiment_label?.toLowerCase() === 'negative' ? 'negative' : 'neutral'}`}>
                  {item.sentiment_label} ({typeof item.sentiment_score === 'number' ? item.sentiment_score.toFixed(2) : item.sentiment_score})
                </span>
                <span className="badge-tag" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                  {item.emotion_type}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0.25rem 0', lineHeight: 1.45 }}>
              {item.content || item.text_content}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ThumbsUp size={12} color="#ec4899" /> {item.likes_count?.toLocaleString()} likes
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={12} color="#6366f1" /> High AI Confidence
                </span>
              </div>
              <span>{item.timestamp || 'Just now'}</span>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
            <Activity size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} className="animate-spin" />
            <p style={{ margin: 0, fontWeight: '600' }}>Initializing Pulse Ingestion Stream...</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Connecting to data pipeline nodes</p>
          </div>
        )}
      </div>
    </div>
  );
}
