import React, { useEffect, useState, useRef } from 'react';
import { Radio, Play, Pause, RefreshCw, Zap, MessageSquare, ThumbsUp, MapPin, Sparkles } from 'lucide-react';

export default function LiveFeed() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const [latestSummary, setLatestSummary] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    // Determine ws url
    let wsUrl;
    const rawApiUrl = import.meta.env.VITE_API_URL;
    if (rawApiUrl) {
      const cleanHost = rawApiUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const wsProtocol = (rawApiUrl.startsWith('https://') || window.location.protocol === 'https:') ? 'wss:' : 'ws:';
      wsUrl = `${wsProtocol}://${cleanHost}/ws/analytics`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      // If running on vite port 3000, Vite proxy forwards /ws, or fall back directly to port 8000
      wsUrl = window.location.port === '3000' 
        ? `ws://127.0.0.1:8000/ws/analytics` 
        : `${protocol}//${host}/ws/analytics`;
    }

    const connectWebSocket = () => {
      try {
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          setIsConnected(true);
          console.log("[LiveFeed WS] Connected to live analytics stream.");
        };

        socket.onmessage = (event) => {
          if (isPaused) return;
          try {
            const data = JSON.parse(event.data);
            if (data.event === "live_feed_update" && data.latest_posts) {
              setMessages((prev) => [...data.latest_posts, ...prev].slice(0, 30));
              setPulseCount((c) => c + 1);
              if (data.sentiment_summary) {
                setLatestSummary(data.sentiment_summary);
              }
            }
          } catch (err) {
            console.error("[LiveFeed WS Error]", err);
          }
        };

        socket.onclose = () => {
          setIsConnected(false);
          // Try reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        };

        socket.onerror = (err) => {
          console.warn("[LiveFeed WS Warning] Reconnecting...", err);
          socket.close();
        };
      } catch (e) {
        console.warn("[LiveFeed WS Init Error]", e);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [isPaused]);

  const clearFeed = () => setMessages([]);

  const getPlatformColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'twitter': return '#38bdf8';
      case 'instagram': return '#ec4899';
      case 'reddit': return '#f97316';
      case 'youtube': return '#ef4444';
      default: return '#a855f7';
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', marginTop: '2rem' }}>
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
                <span className="badge-tag">WebSocket Live</span>
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Streaming live synthetic ingestion pulses with emotion & toxicity classification
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="status-pill">
            <span 
              className="pulsing-dot" 
              style={{ backgroundColor: isConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)' }} 
            />
            <span>{isConnected ? 'Stream Active' : 'Connecting to Node...'}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({pulseCount} Pulses)</span>
          </div>

          <button 
            className="btn-secondary" 
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume stream" : "Pause stream"}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <button className="btn-secondary" onClick={clearFeed} title="Clear live feed">
            <RefreshCw size={14} />
            Clear
          </button>
        </div>
      </div>

      {/* Pulse Metrics Bar */}
      {latestSummary && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem', 
          padding: '0.75rem 1rem', 
          background: 'rgba(255, 255, 255, 0.02)', 
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.25rem',
          fontSize: '0.82rem'
        }}>
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Zap size={14} color="#f59e0b" /> Latest Pulse Breakdown:
          </span>
          <span style={{ color: '#34d399', fontWeight: '600' }}>
            Positive: {latestSummary.Positive || 0}
          </span>
          <span style={{ color: '#fbbf24', fontWeight: '600' }}>
            Neutral: {latestSummary.Neutral || 0}
          </span>
          <span style={{ color: '#fb7185', fontWeight: '600' }}>
            Negative: {latestSummary.Negative || 0}
          </span>
        </div>
      )}

      {/* Feed list */}
      <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Sparkles size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>Connecting to websocket pulse stream at /ws/analytics...</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Live ingested social posts will stream here automatically.</p>
          </div>
        ) : (
          messages.map((post, idx) => {
            const sentimentClass = post.sentiment_label?.toLowerCase() || 'neutral';
            return (
              <div key={`${post.post_id}-${idx}`} className="stream-pulse-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span 
                      style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: '700', 
                        padding: '0.15rem 0.5rem', 
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: getPlatformColor(post.platform),
                        border: `1px solid ${getPlatformColor(post.platform)}40`
                      }}
                    >
                      {post.platform || 'Social'}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      @{post.user_id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {post.emotion_type && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {post.emotion_type}
                      </span>
                    )}
                    <span className={`sentiment-badge ${sentimentClass}`}>
                      {post.sentiment_label} ({post.sentiment_score > 0 ? `+${post.sentiment_score}` : post.sentiment_score})
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '0.65rem' }}>
                  {post.content}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ThumbsUp size={12} /> {post.likes_count?.toLocaleString()} likes
                  </span>
                  {post.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={12} /> {post.location}
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                    ID: {post.post_id}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
