import pandas as pd
from typing import Dict, Any

def process_sentiment_trends(df: pd.DataFrame) -> Dict[str, Any]:
    if df is None or df.empty:
        return {
            "timeline": [],
            "emotions": {},
            "sentiment_breakdown": {},
            "overall_score": 0.0,
            "overall_toxicity": 0.0,
            "total_posts": 0
        }

    df = df.copy()
    if 'timestamp' in df.columns:
        df['timestamp'] = pd.to_datetime(df['timestamp'])

    # Aggregate by day for timeline
    if 'timestamp' in df.columns:
        resample_rules = {}
        if 'sentiment_score' in df.columns:
            resample_rules['sentiment_score'] = 'mean'
        if 'toxicity_score' in df.columns:
            resample_rules['toxicity_score'] = 'mean'
        if 'likes_count' in df.columns:
            resample_rules['likes_count'] = 'sum'
        
        count_col = 'post_id' if 'post_id' in df.columns else df.columns[0]
        resample_rules[count_col] = 'count'

        timeline_df = df.set_index('timestamp').resample('D').agg(resample_rules).reset_index()
        timeline_df['timestamp'] = timeline_df['timestamp'].dt.strftime('%Y-%m-%d')
        timeline_df = timeline_df.rename(columns={count_col: 'volume'}).fillna(0)
        
        if 'sentiment_score' in timeline_df.columns:
            timeline_df['sentiment_score'] = timeline_df['sentiment_score'].round(3)
        if 'toxicity_score' in timeline_df.columns:
            timeline_df['toxicity_score'] = timeline_df['toxicity_score'].round(3)

        timeline = timeline_df.to_dict(orient='records')
    else:
        timeline = []

    emotions = df['emotion_type'].value_counts().to_dict() if 'emotion_type' in df.columns else {}
    sentiment_breakdown = df['sentiment_label'].value_counts().to_dict() if 'sentiment_label' in df.columns else {}
    
    avg_sentiment = float(df['sentiment_score'].mean()) if 'sentiment_score' in df.columns else 0.0
    avg_toxicity = float(df['toxicity_score'].mean()) if 'toxicity_score' in df.columns else 0.0

    return {
        "timeline": timeline,
        "emotions": {str(k): int(v) for k, v in emotions.items()},
        "sentiment_breakdown": {str(k): int(v) for k, v in sentiment_breakdown.items()},
        "overall_score": round(avg_sentiment, 3),
        "overall_toxicity": round(avg_toxicity, 3),
        "total_posts": len(df)
    }
