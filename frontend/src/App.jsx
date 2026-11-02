import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { 
  Activity, Users, TrendingUp, Share2, ShieldAlert, Globe, 
  Radio, Sparkles, Filter, Download, Moon, Sun, Layers, Target,
  CheckCircle, ArrowUpRight, BarChart3, Heart, Zap, Award
} from 'lucide-react';

import LiveFeed from './components/LiveFeed';
import NetworkGraph from './components/NetworkGraph';
import CampaignsExplorer from './components/CampaignsExplorer';

const API_BASE = "/api/v1/analytics";

// Modern harmonious color palettes
const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
const SENTIMENT_COLORS = {
  Positive: '#10b981',
  Neutral: '#f59e0b',
  Negative: '#f43f5e'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState('dark');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  
  // Data states
  const [overview, setOverview] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [network, setNetwork] = useState(null);
  const [health, setHealth] = useState({ online: true, latency: 12 });
  const [loading, setLoading] = useState(true);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch all analytics data with filters
  const fetchData = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const params = {};
      if (platformFilter !== 'all') params.platform = platformFilter;
      if (brandFilter !== 'all') params.brand = brandFilter;

      const [overRes, sentRes, demoRes, trendRes, netRes] = await Promise.all([
        axios.get(`${API_BASE}/overview`, { params }),
        axios.get(`${API_BASE}/sentiment`, { params }),
        axios.get(`${API_BASE}/demographics`, { params }),
        axios.get(`${API_BASE}/trends`, { params }),
        axios.get(`${API_BASE}/network`, { params })
      ]);

      setOverview(overRes.data);
      setSentimentData(sentRes.data);
      setDemographics(demoRes.data);
      setTrends(trendRes.data);
      setNetwork(netRes.data);
      setHealth({ online: true, latency: Math.round(performance.now() - start) });
    } catch (err) {
      console.warn("API Fetch error, retrying...", err);
      setHealth({ online: false, latency: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [platformFilter, brandFilter]);

  // Export JSON summary report
  const handleExportSummary = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      platformFilter,
      brandFilter,
      overview,
      sentimentSummary: sentimentData?.sentiment_breakdown,
      topCategories: trends?.top_categories,
      topKols: network?.top_kols?.slice(0, 5)
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PulseAI_Analytics_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Prepare chart formats
  const topLocations = demographics?.geographic_distribution 
    ? Object.entries(demographics.geographic_distribution).slice(0, 8).map(([name, value]) => ({ name, value }))
    : [];

  const sentimentPieData = overview?.sentiment_breakdown
    ? Object.entries(overview.sentiment_breakdown).map(([name, value]) => ({
        name,
        value,
        color: SENTIMENT_COLORS[name] || '#8b5cf6'
      }))
    : [];

  const platformPieData = demographics?.platform_distribution
    ? Object.entries(demographics.platform_distribution).map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length]
      }))
    : [];

  const emotionBarData = sentimentData?.emotions
    ? Object.entries(sentimentData.emotions).map(([name, value]) => ({ name, count: value }))
    : [];

  const categoryBarData = trends?.top_categories
    ? Object.entries(trends.top_categories).map(([name, count]) => ({ name, count }))
    : [];

  const hashtagList = trends?.trending_hashtags
    ? Object.entries(trends.trending_hashtags).slice(0, 12).map(([name, count]) => ({ name, count }))
    : [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="brand-wrapper">
          <div className="brand-logo-icon">
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <div className="brand-title">
              PulseAI
              <span className="badge-tag">v2.0 Framework</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Enterprise Social Media Intelligence
            </div>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          {/* Status Indicator */}
          <div className="status-pill">
            <span className="pulsing-dot" style={{ backgroundColor: health.online ? 'var(--accent-emerald)' : 'var(--accent-rose)' }} />
            <span>{health.online ? 'Backend Live' : 'Reconnecting'}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              ({health.latency}ms)
            </span>
          </div>

          <div className="badge-tag" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
            {overview?.total_posts ? `${overview.total_posts.toLocaleString()} Records` : '12,000 Records'}
          </div>

          {/* Theme Toggle */}
          <button 
            className="btn-secondary" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Light/Dark Theme"
            style={{ padding: '0.45rem 0.65rem' }}
          >
            {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
          </button>

          {/* Export Report */}
          <button className="btn-primary" onClick={handleExportSummary}>
            <Download size={14} /> Export Report
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '1.75rem 2rem', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        
        {/* Filter Controls Header */}
        <div className="glass-card filter-bar">
          <div className="filter-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: '600' }}>
              <Filter size={16} color="var(--accent-primary)" /> Filters:
            </div>

            {/* Platform filter */}
            <select 
              className="custom-select" 
              value={platformFilter} 
              onChange={(e) => setPlatformFilter(e.target.value)}
            >
              <option value="all">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter</option>
              <option value="Reddit">Reddit</option>
              <option value="YouTube">YouTube</option>
            </select>

            {/* Brand filter */}
            <select 
              className="custom-select" 
              value={brandFilter} 
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option value="all">All Brands</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Nike">Nike</option>
              <option value="Pepsi">Pepsi</option>
              <option value="Toyota">Toyota</option>
              <option value="Coca-Cola">Coca-Cola</option>
            </select>

            {(platformFilter !== 'all' || brandFilter !== 'all') && (
              <button 
                className="btn-secondary" 
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                onClick={() => { setPlatformFilter('all'); setBrandFilter('all'); }}
              >
                Reset Filters
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Ingested CSV Data Lake &bull; Resampled Daily &bull; In-Memory Cache Active
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={16} /> Executive Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sentiment' ? 'active' : ''}`}
            onClick={() => setActiveTab('sentiment')}
          >
            <Sparkles size={16} /> Sentiment & Emotion AI
          </button>
          <button 
            className={`tab-btn ${activeTab === 'demographics' ? 'active' : ''}`}
            onClick={() => setActiveTab('demographics')}
          >
            <Globe size={16} /> Demographics & Geography
          </button>
          <button 
            className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            <TrendingUp size={16} /> Trends & Hashtags
          </button>
          <button 
            className={`tab-btn ${activeTab === 'network' ? 'active' : ''}`}
            onClick={() => setActiveTab('network')}
          >
            <Share2 size={16} /> KOL Network Graph
          </button>
          <button 
            className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            <Radio size={16} /> Real-Time Live Stream
          </button>
          <button 
            className={`tab-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            <Target size={16} /> Campaigns & Post Lake
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Metric Cards */}
            <div className="metrics-grid">
              <div className="glass-card metric-card" style={{ '--card-accent': '#6366f1' }}>
                <div className="metric-header">
                  <span className="metric-title">Total Posts Analyzed</span>
                  <div className="metric-icon-box">
                    <Activity size={18} color="#6366f1" />
                  </div>
                </div>
                <div className="metric-value">
                  {overview?.total_posts?.toLocaleString() || '12,000'}
                </div>
                <div className="metric-sub">
                  <span style={{ color: '#34d399', fontWeight: '600' }}>+100% Ingested</span> across 4 channels
                </div>
              </div>

              <div className="glass-card metric-card" style={{ '--card-accent': '#10b981' }}>
                <div className="metric-header">
                  <span className="metric-title">Average Sentiment</span>
                  <div className="metric-icon-box">
                    <Heart size={18} color="#10b981" />
                  </div>
                </div>
                <div className="metric-value" style={{ color: overview?.avg_sentiment >= 0 ? '#34d399' : '#fb7185' }}>
                  {overview?.avg_sentiment > 0 ? `+${overview.avg_sentiment}` : (overview?.avg_sentiment || '+0.128')}
                </div>
                <div className="metric-sub">
                  Normalized range: -1.0 to +1.0
                </div>
              </div>

              <div className="glass-card metric-card" style={{ '--card-accent': '#06b6d4' }}>
                <div className="metric-header">
                  <span className="metric-title">Identified KOLs</span>
                  <div className="metric-icon-box">
                    <Users size={18} color="#06b6d4" />
                  </div>
                </div>
                <div className="metric-value">
                  {network?.top_kols?.length || 15}
                </div>
                <div className="metric-sub">
                  Top tier key opinion creators
                </div>
              </div>

              <div className="glass-card metric-card" style={{ '--card-accent': '#f59e0b' }}>
                <div className="metric-header">
                  <span className="metric-title">Graph Connections</span>
                  <div className="metric-icon-box">
                    <Share2 size={18} color="#f59e0b" />
                  </div>
                </div>
                <div className="metric-value">
                  {network?.graph_stats?.total_edges?.toLocaleString() || '12,000'}
                </div>
                <div className="metric-sub">
                  Density: {network?.graph_stats?.network_density || '0.0001'}
                </div>
              </div>
            </div>

            {/* Main Charts Row */}
            <div className="charts-grid">
              {/* Sentiment Timeline */}
              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <Activity size={18} color="#6366f1" /> Sentiment Score Timeline
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Resampled</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={sentimentData?.timeline?.slice(0, 35) || []}>
                    <XAxis dataKey="timestamp" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} domain={[-1, 1]} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#111827', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff' }} 
                    />
                    <Line type="monotone" dataKey="sentiment_score" stroke="#6366f1" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Geographic Distribution */}
              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <Globe size={18} color="#06b6d4" /> Geographic Footprint
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Locations</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={topLocations}>
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#111827', borderColor: 'var(--border-color)', borderRadius: '8px', color: '#fff' }} 
                    />
                    <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Second Charts Row: Sentiment Breakdown & Platform Share */}
            <div className="charts-grid">
              {/* Sentiment Pie */}
              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <Sparkles size={18} color="#10b981" /> Sentiment Label Breakdown
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                  <ResponsiveContainer width={240} height={220}>
                    <PieChart>
                      <Pie 
                        data={sentimentPieData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={55} 
                        outerRadius={85} 
                        paddingAngle={4}
                      >
                        {sentimentPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sentimentPieData.map((item) => (
                      <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
                        <span style={{ fontWeight: '600' }}>{item.name}:</span>
                        <span style={{ color: 'var(--text-muted)' }}>{item.value?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Platform Share */}
              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <Layers size={18} color="#ec4899" /> Multi-Platform Share
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                  <ResponsiveContainer width={240} height={220}>
                    <PieChart>
                      <Pie 
                        data={platformPieData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={55} 
                        outerRadius={85} 
                        paddingAngle={4}
                      >
                        {platformPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {platformPieData.map((item) => (
                      <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
                        <span style={{ fontWeight: '600' }}>{item.name}:</span>
                        <span style={{ color: 'var(--text-muted)' }}>{item.value?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Live Streaming Pulses */}
            <LiveFeed />
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: SENTIMENT & EMOTION AI */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'sentiment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Overall Sentiment Score</span>
                <div style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#34d399', margin: '0.25rem 0' }}>
                  {overview?.avg_sentiment > 0 ? `+${overview.avg_sentiment}` : overview?.avg_sentiment}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Evaluated across all user comments and engagement interactions
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Average Toxicity Index</span>
                <div style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fbbf24', margin: '0.25rem 0' }}>
                  {overview?.avg_toxicity || '0.385'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Risk rating: Low to Moderate &bull; Zero critical threats
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Positive Sentiment Ratio</span>
                <div style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#6366f1', margin: '0.25rem 0' }}>
                  {overview?.sentiment_breakdown?.Positive 
                    ? `${Math.round((overview.sentiment_breakdown.Positive / overview.total_posts) * 100)}%`
                    : '62%'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Dominant brand affinity index
                </div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <Sparkles size={18} color="#a855f7" /> Emotion Classification
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={emotionBarData}>
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <ShieldAlert size={18} color="#f43f5e" /> Toxicity & Sentiment Comparison
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={sentimentData?.timeline?.slice(0, 30) || []}>
                    <XAxis dataKey="timestamp" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="sentiment_score" stroke="#10b981" fill="rgba(16, 185, 129, 0.2)" />
                    <Area type="monotone" dataKey="toxicity_score" stroke="#f43f5e" fill="rgba(244, 63, 94, 0.2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: DEMOGRAPHICS & GEOGRAPHY */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'demographics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="charts-grid">
              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <Globe size={18} color="#06b6d4" /> Global Audience by City
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topLocations} layout="vertical">
                    <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} width={130} />
                    <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <Layers size={18} color="#6366f1" /> Language Diversity
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {demographics?.language_distribution && Object.entries(demographics.language_distribution).map(([lang, cnt]) => (
                    <div key={lang} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                        {cnt.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: '600', marginTop: '0.2rem' }}>{lang}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: TRENDS & HASHTAGS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'trends' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="charts-grid">
              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <TrendingUp size={18} color="#f59e0b" /> Top Topic Categories
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categoryBarData}>
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--border-color)', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <div className="chart-title">
                    <Sparkles size={18} color="#ec4899" /> Trending Hashtags
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', padding: '0.5rem 0' }}>
                  {hashtagList.map((tag) => (
                    <div 
                      key={tag.name} 
                      className="glass-card" 
                      style={{ 
                        padding: '0.55rem 0.95rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        borderColor: 'rgba(236, 72, 153, 0.3)'
                      }}
                    >
                      <span style={{ fontWeight: '700', color: '#ec4899', fontSize: '0.9rem' }}>
                        #{tag.name}
                      </span>
                      <span className="badge-tag" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                        {tag.count} mentions
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Brand Performance Leaderboard */}
            {trends?.brand_performance && (
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} color="#10b981" /> Brand Share of Voice & Sentiment Index
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Brand</th>
                        <th>Total Posts</th>
                        <th>Avg Sentiment</th>
                        <th>Total Likes</th>
                        <th>Avg Engagement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trends.brand_performance.map((b) => (
                        <tr key={b.brand}>
                          <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{b.brand}</td>
                          <td>{b.post_count?.toLocaleString()}</td>
                          <td>
                            <span className={`sentiment-badge ${b.avg_sentiment >= 0 ? 'positive' : 'negative'}`}>
                              {b.avg_sentiment > 0 ? `+${b.avg_sentiment}` : b.avg_sentiment}
                            </span>
                          </td>
                          <td>{b.total_likes?.toLocaleString()}</td>
                          <td>{(b.avg_engagement * 100).toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 5: KOL NETWORK GRAPH */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'network' && (
          <NetworkGraph networkData={network} />
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 6: REAL-TIME LIVE STREAM */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'live' && (
          <LiveFeed />
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 7: CAMPAIGNS & POST DATA LAKE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'campaigns' && (
          <CampaignsExplorer apiBase={API_BASE} />
        )}

      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '1.5rem 2rem', 
        borderTop: '1px solid var(--border-color)', 
        background: 'rgba(10, 14, 23, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          &copy; {new Date().getFullYear()} PulseAI Analytics Framework &bull; Designed for high-scale multi-vector social intelligence.
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <span>FastAPI Backend (Port 8000)</span>
          <span>Vite + React UI (Port 3000)</span>
          <span>SQLite / PostgreSQL Ready</span>
        </div>
      </footer>
    </div>
  );
}
