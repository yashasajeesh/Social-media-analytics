import React, { useState } from 'react';
import { Users, Share2, Award, Zap, TrendingUp, ShieldCheck, Search } from 'lucide-react';

export default function NetworkGraph({ networkData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKol, setSelectedKol] = useState(null);

  const kols = networkData?.top_kols || [];
  const stats = networkData?.graph_stats || { total_nodes: 0, total_edges: 0, network_density: 0, avg_degree: 0 };
  const nodes = networkData?.nodes || [];

  const filteredKols = kols.filter(k => 
    k.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.primary_platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Network Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Graph Nodes (Entities)</span>
            <Users size={16} color="#6366f1" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            {stats.total_nodes?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Active authors & @mentions
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Interactions / Edges</span>
            <Share2 size={16} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            {stats.total_edges?.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Cross-entity connections
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Network Density</span>
            <Zap size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            {stats.network_density}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Graph interconnectivity ratio
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Avg Degree Centrality</span>
            <TrendingUp size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            {stats.avg_degree}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Average linkages per node
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Visual Graph View */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Share2 size={18} color="#8b5cf6" /> Topology Visualizer
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Top 30 Influential Node Clusters
            </span>
          </div>

          {/* SVG Graph representation */}
          <div style={{ 
            flex: 1, 
            minHeight: '340px', 
            background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="100%" height="340" viewBox="0 0 500 340">
              <defs>
                <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Connecting lines */}
              {nodes.map((node, i) => {
                const angle = (i / Math.max(nodes.length, 1)) * 2 * Math.PI;
                const radius = 110 + (i % 2 === 0 ? 30 : -20);
                const x = 250 + radius * Math.cos(angle);
                const y = 170 + radius * Math.sin(angle);
                return (
                  <line 
                    key={`line-${i}`}
                    x1="250" 
                    y1="170" 
                    x2={x} 
                    y2={y} 
                    stroke="url(#edgeGrad)" 
                    strokeWidth={i % 3 === 0 ? "1.5" : "0.75"} 
                    strokeDasharray={i % 4 === 0 ? "3,3" : "none"}
                  />
                );
              })}

              {/* Center Hub Node */}
              <circle cx="250" cy="170" r="28" fill="#6366f1" filter="url(#glow)" opacity="0.9" />
              <circle cx="250" cy="170" r="32" fill="none" stroke="#a5b4fc" strokeWidth="1.5" opacity="0.6" />
              <text x="250" y="174" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                KOL HUB
              </text>

              {/* Peripheral Nodes */}
              {nodes.map((node, i) => {
                const angle = (i / Math.max(nodes.length, 1)) * 2 * Math.PI;
                const radius = 110 + (i % 2 === 0 ? 30 : -20);
                const x = 250 + radius * Math.cos(angle);
                const y = 170 + radius * Math.sin(angle);
                const isKol = node.group === 1;
                const color = isKol ? "#ec4899" : "#06b6d4";

                return (
                  <g 
                    key={`node-${i}`} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const matched = kols.find(k => k.user_id === node.id);
                      if (matched) setSelectedKol(matched);
                    }}
                  >
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={node.size ? node.size / 2.5 : 8} 
                      fill={color} 
                      opacity="0.85"
                    />
                    <text 
                      x={x} 
                      y={y + 14} 
                      textAnchor="middle" 
                      fill="var(--text-secondary)" 
                      fontSize="8"
                    >
                      {node.label?.slice(0, 8)}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div style={{ position: 'absolute', bottom: '10px', left: '14px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              🟣 Center Hub &nbsp; 🌸 Key Influencers &nbsp; 🔷 Active Mentions
            </div>
          </div>
        </div>

        {/* KOL Leaderboard */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#f59e0b" /> Top Key Opinion Leaders
            </h3>
            <span className="badge-tag">{kols.length} Identified</span>
          </div>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search influencer or platform..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ maxHeight: '330px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredKols.map((kol, idx) => (
              <div 
                key={kol.user_id} 
                className="glass-card" 
                onClick={() => setSelectedKol(kol)}
                style={{ 
                  padding: '0.85rem 1rem', 
                  cursor: 'pointer',
                  borderColor: selectedKol?.user_id === kol.user_id ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: selectedKol?.user_id === kol.user_id ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      background: idx < 3 ? 'var(--gradient-brand)' : 'rgba(255,255,255,0.08)',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold', 
                      fontSize: '0.75rem',
                      color: '#ffffff'
                    }}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{kol.handle}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {kol.primary_platform} • {kol.posts_count} posts
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: '800', 
                      color: 'var(--accent-cyan)',
                      fontFamily: 'var(--font-heading)'
                    }}>
                      {kol.influence_score}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Influence Score</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.45rem', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Reach: {kol.total_impressions?.toLocaleString()} impressions</span>
                  <span style={{ color: kol.engagement_growth >= 0 ? '#34d399' : '#fb7185' }}>
                    {kol.engagement_growth >= 0 ? `+${kol.engagement_growth}` : kol.engagement_growth} Growth
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
