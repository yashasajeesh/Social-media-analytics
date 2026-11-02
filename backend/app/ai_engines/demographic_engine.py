import pandas as pd
from typing import Dict, Any

def process_demographic_insights(df: pd.DataFrame) -> Dict[str, Any]:
    if df is None or df.empty:
        return {
            "geographic_distribution": {},
            "language_distribution": {},
            "platform_distribution": {},
            "top_countries": {},
            "engagement_by_platform": {}
        }

    geo_dist = {}
    top_countries = {}
    if 'location' in df.columns:
        # Full locations (e.g. "Melbourne, Australia")
        geo_dist = df['location'].dropna().value_counts().head(12).to_dict()

        # Extract countries by taking substring after comma
        def extract_country(loc):
            if pd.isna(loc):
                return "Unknown"
            parts = str(loc).split(",")
            return parts[-1].strip() if len(parts) > 1 else str(loc).strip()

        countries = df['location'].apply(extract_country)
        top_countries = countries.value_counts().head(10).to_dict()

    lang_dist = {}
    if 'language' in df.columns:
        # Map common language codes to readable names
        lang_names = {
            "en": "English", "es": "Spanish", "ja": "Japanese",
            "ru": "Russian", "pt": "Portuguese", "hi": "Hindi",
            "de": "German", "fr": "French", "zh": "Chinese"
        }
        raw_langs = df['language'].dropna().value_counts().head(8).to_dict()
        lang_dist = {lang_names.get(k, k.upper()): int(v) for k, v in raw_langs.items()}

    platform_dist = {}
    engagement_by_platform = {}
    if 'platform' in df.columns:
        platform_dist = df['platform'].value_counts().to_dict()
        if 'engagement_rate' in df.columns:
            eng_means = df.groupby('platform')['engagement_rate'].mean().round(4).to_dict()
            engagement_by_platform = {str(k): float(v) for k, v in eng_means.items()}

    return {
        "geographic_distribution": {str(k): int(v) for k, v in geo_dist.items()},
        "language_distribution": {str(k): int(v) for k, v in lang_dist.items()},
        "platform_distribution": {str(k): int(v) for k, v in platform_dist.items()},
        "top_countries": {str(k): int(v) for k, v in top_countries.items()},
        "engagement_by_platform": engagement_by_platform
    }
