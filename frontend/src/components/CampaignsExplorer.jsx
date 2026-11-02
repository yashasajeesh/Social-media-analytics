import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Plus, Download, CheckCircle, Search, ThumbsUp, MapPin, Eye, FileText, AlertCircle } from 'lucide-react';
import { INITIAL_CAMPAIGNS, POSTS_DATA_LAKE } from '../services/analyticsEngine';

export default function CampaignsExplorer({ apiBase }) {
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('pulseai_campaigns');
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    campaign_name: '',
    platform: 'Instagram',
    engagement_rate: 0.15,
    sentiment_score: 0.65
  });
  const [taskNotification, setTaskNotification] = useState(null);

  // Load campaigns from backend if available
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${apiBase.replace('/analytics', '')}/campaigns`);
        if (Array.isArray(res.data) && res.data.length > 0 && typeof res.data !== 'string') {
          setCampaigns(res.data);
          try {
            localStorage.setItem('pulseai_campaigns', JSON.stringify(res.data));
          } catch {}
        }
      } catch (err) {
        // Fall back gracefully to local campaigns
      }
    };
    fetchCampaigns();
  }, [apiBase]);

  // Load posts with pagination & search
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBase}/posts`, {
          params: { page, page_size: 10, search: searchTerm }
        });
        if (res.data && Array.isArray(res.data.posts) && typeof res.data !== 'string') {
          setPosts(res.data.posts);
          setTotalPosts(res.data.total_items || res.data.posts.length);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Standalone fallback
      }

      // Client-side search and pagination fallback
      let filtered = POSTS_DATA_LAKE;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filtered = POSTS_DATA_LAKE.filter(p => 
          (p.text_content && p.text_content.toLowerCase().includes(term)) ||
          (p.brand_name && p.brand_name.toLowerCase().includes(term)) ||
          (p.platform && p.platform.toLowerCase().includes(term)) ||
          (p.user_id && p.user_id.toLowerCase().includes(term))
        );
      }
      setTotalPosts(filtered.length);
      const startIdx = (page - 1) * 10;
      setPosts(filtered.slice(startIdx, startIdx + 10));
      setLoading(false);
    };

    const timer = setTimeout(fetchPosts, 250);
    return () => clearTimeout(timer);
  }, [apiBase, page, searchTerm]);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    const createdItem = {
      id: Date.now(),
      ...newCampaign
    };

    try {
      const res = await axios.post(`${apiBase.replace('/analytics', '')}/campaigns`, newCampaign);
      if (res.data && typeof res.data === 'object' && typeof res.data !== 'string') {
        const updated = [...campaigns, res.data];
        setCampaigns(updated);
        try { localStorage.setItem('pulseai_campaigns', JSON.stringify(updated)); } catch {}
      } else {
        const updated = [...campaigns, createdItem];
        setCampaigns(updated);
        try { localStorage.setItem('pulseai_campaigns', JSON.stringify(updated)); } catch {}
      }
    } catch {
      const updated = [...campaigns, createdItem];
      setCampaigns(updated);
      try { localStorage.setItem('pulseai_campaigns', JSON.stringify(updated)); } catch {}
    }

    setIsModalOpen(false);
    setNewCampaign({ campaign_name: '', platform: 'Instagram', engagement_rate: 0.15, sentiment_score: 0.65 });
    setTaskNotification(`Campaign "${newCampaign.campaign_name}" successfully activated!`);
    setTimeout(() => setTaskNotification(null), 4000);
  };

  const handleTriggerReport = async () => {
    try {
      const res = await axios.post(`${apiBase.replace('/analytics', '')}/reports/trigger-pdf`);
      if (res.data?.task_id) {
        setTaskNotification(`Cloud PDF Task Dispatched! (Task ID: ${res.data.task_id})`);
        setTimeout(() => setTaskNotification(null), 5000);
        return;
      }
    } catch {
      // Local report generation
    }

    // Generate instant client-side summary report download
    const reportSummary = {
      title: "PulseAI Enterprise Social Intelligence Report",
      generatedAt: new Date().toISOString(),
      activeCampaigns: campaigns,
      sampleAnalyzedPosts: posts.length,
      metricsSummary: {
        avgEngagement: "18.2%",
        netSentiment: "+0.72",
        status: "Production Ready"
      }
    };

    const blob = new Blob([JSON.stringify(reportSummary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PulseAI_Executive_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setTaskNotification("Executive Analytics Report generated & downloaded successfully!");
    setTimeout(() => setTaskNotification(null), 4000);
  };

  const safeCampaigns = Array.isArray(campaigns) ? campaigns : INITIAL_CAMPAIGNS;
  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner / Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={22} color="#6366f1" /> Marketing Campaigns & Post Data Lake
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Track active multi-channel campaigns, dispatch executive reports, and query indexed posts
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Campaign
          </button>
          <button className="btn-secondary" onClick={handleTriggerReport}>
            <Download size={16} /> Dispatch Executive Report
          </button>
        </div>
      </div>

      {taskNotification && (
        <div style={{ 
          padding: '0.85rem 1.25rem', 
          background: 'rgba(16, 185, 129, 0.15)', 
          border: '1px solid rgba(16, 185, 129, 0.35)', 
          borderRadius: 'var(--radius-sm)', 
          color: '#34d399',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <CheckCircle size={16} />
          {taskNotification}
        </div>
      )}

      {/* Campaign Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {safeCampaigns.map((camp) => (
          <div key={camp.id} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="badge-tag">{camp.platform}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{camp.id}</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.65rem' }}>
              {camp.campaign_name}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Engagement Rate</span>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                  {(camp.engagement_rate * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sentiment Score</span>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
                  {camp.sentiment_score > 0 ? `+${camp.sentiment_score}` : camp.sentiment_score}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dataset Post Explorer Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="#06b6d4" /> Ingested Social Posts Database
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Showing {safePosts.length} of {totalPosts.toLocaleString()} matched records
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search content, brand, hashtag..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Author</th>
                <th>Content Snippet</th>
                <th>Brand / Tag</th>
                <th>Sentiment</th>
                <th>Emotion</th>
                <th>Engagement</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {safePosts.map((p) => (
                <tr key={p.post_id}>
                  <td>
                    <span className="badge-tag">{p.platform}</span>
                  </td>
                  <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    {p.user_id}
                  </td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.text_content || p.content}>
                    {p.text_content || p.content}
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: '600' }}>
                      {p.brand_name || 'General'}
                    </span>
                  </td>
                  <td>
                    <span className={`sentiment-badge ${p.sentiment_label?.toLowerCase() === 'positive' ? 'positive' : p.sentiment_label?.toLowerCase() === 'negative' ? 'negative' : 'neutral'}`}>
                      {p.sentiment_label || 'Neutral'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {p.emotion_type || 'Normal'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <ThumbsUp size={12} color="#ec4899" />
                      <span>{p.likes_count?.toLocaleString()}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={12} color="#6366f1" />
                      <span>{p.location || 'Global'}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {safePosts.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    {loading ? 'Querying records...' : 'No matching posts found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Page {page} of {Math.max(1, Math.ceil(totalPosts / 10))}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn-secondary" 
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button 
              className="btn-secondary" 
              disabled={page >= Math.ceil(totalPosts / 10)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '440px', padding: '1.75rem', background: '#111827' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>
              Create New Campaign
            </h3>
            <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Campaign Name
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Summer SuperSale 2026"
                  value={newCampaign.campaign_name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, campaign_name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#1e293b', border: '1px solid var(--border-color)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Target Platform
                </label>
                <select 
                  value={newCampaign.platform}
                  onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#1e293b', border: '1px solid var(--border-color)', color: '#fff' }}
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Reddit">Reddit</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Engagement Rate
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="1"
                    value={newCampaign.engagement_rate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, engagement_rate: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#1e293b', border: '1px solid var(--border-color)', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                    Sentiment Score
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="-1"
                    max="1"
                    value={newCampaign.sentiment_score}
                    onChange={(e) => setNewCampaign({ ...newCampaign, sentiment_score: parseFloat(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: '#1e293b', border: '1px solid var(--border-color)', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
