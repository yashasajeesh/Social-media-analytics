import pandas as pd
import re
from typing import Dict, Any

def process_trending_topics(df: pd.DataFrame) -> Dict[str, Any]:
    if df is None or df.empty:
        return {
            "trending_hashtags": {},
            "top_categories": {},
            "top_keywords": {},
            "brand_performance": {},
            "campaign_phases": {}
        }

    # 1. Parse hashtags: support comma-separated, space-separated, # prefixed
    hashtag_counts: Dict[str, int] = {}
    if 'hashtags' in df.columns:
        for val in df['hashtags'].dropna():
            # Split by comma or whitespace
            tokens = re.split(r'[, ]+', str(val))
            for token in tokens:
                cleaned = token.strip().lstrip('#').strip()
                if cleaned:
                    hashtag_counts[cleaned] = hashtag_counts.get(cleaned, 0) + 1

    # Sort hashtags descending by count
    sorted_hashtags = dict(sorted(hashtag_counts.items(), key=lambda item: item[1], reverse=True)[:20])

    # 2. Topic categories
    top_categories = {}
    if 'topic_category' in df.columns:
        top_categories = df['topic_category'].dropna().value_counts().head(10).to_dict()

    # 3. Top keywords
    top_keywords = {}
    if 'keywords' in df.columns:
        kw_counts: Dict[str, int] = {}
        for val in df['keywords'].dropna():
            for kw in str(val).split(','):
                k = kw.strip().lower()
                if len(k) > 2:
                    kw_counts[k] = kw_counts.get(k, 0) + 1
        top_keywords = dict(sorted(kw_counts.items(), key=lambda item: item[1], reverse=True)[:15])

    # 4. Brand performance
    brand_performance = {}
    if 'brand_name' in df.columns:
        brand_grouped = df.groupby('brand_name').agg({
            'sentiment_score': 'mean',
            'likes_count': 'sum',
            'engagement_rate': 'mean',
            df.columns[0]: 'count'
        }).rename(columns={df.columns[0]: 'post_count'}).reset_index()

        brand_performance = [
            {
                "brand": row['brand_name'],
                "post_count": int(row['post_count']),
                "avg_sentiment": round(float(row['sentiment_score']), 3),
                "total_likes": int(row['likes_count']),
                "avg_engagement": round(float(row['engagement_rate']), 4)
            }
            for _, row in brand_grouped.iterrows()
        ]

    # 5. Campaign phases
    campaign_phases = {}
    if 'campaign_phase' in df.columns:
        campaign_phases = df['campaign_phase'].dropna().value_counts().to_dict()

    return {
        "trending_hashtags": sorted_hashtags,
        "top_categories": {str(k): int(v) for k, v in top_categories.items()},
        "top_keywords": top_keywords,
        "brand_performance": brand_performance,
        "campaign_phases": {str(k): int(v) for k, v in campaign_phases.items()}
    }
