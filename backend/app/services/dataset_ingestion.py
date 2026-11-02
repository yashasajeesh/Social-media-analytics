import pandas as pd
import os
from typing import Optional

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Check possible paths for dataset
CANDIDATE_PATHS = [
    os.path.abspath(os.path.join(BASE_DIR, "../../data/Social Media Engagement Dataset.csv")),
    os.path.abspath(os.path.join(BASE_DIR, "../data/Social Media Engagement Dataset.csv")),
    os.path.abspath(os.path.join(os.getcwd(), "backend/data/Social Media Engagement Dataset.csv")),
    os.path.abspath(os.path.join(os.getcwd(), "data/Social Media Engagement Dataset.csv")),
]

DATASET_PATH = next((p for p in CANDIDATE_PATHS if os.path.exists(p)), CANDIDATE_PATHS[0])

class DataRepository:
    _instance = None
    df: pd.DataFrame = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataRepository, cls).__new__(cls)
            cls._instance.load_data()
        return cls._instance

    def load_data(self):
        if os.path.exists(DATASET_PATH):
            self.df = pd.read_csv(DATASET_PATH)
            self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])
            
            # Normalize column names: ensure 'content' exists
            if 'text_content' in self.df.columns and 'content' not in self.df.columns:
                self.df['content'] = self.df['text_content']
            elif 'content' in self.df.columns and 'text_content' not in self.df.columns:
                self.df['text_content'] = self.df['content']

            print(f"[Dataset Loaded]: {len(self.df)} records successfully initialized from {DATASET_PATH}.")
        else:
            raise FileNotFoundError(f"Dataset not found at any path. Checked: {CANDIDATE_PATHS}")

    def get_data(self) -> pd.DataFrame:
        return self.df

    def get_filtered_data(
        self,
        platform: Optional[str] = None,
        brand: Optional[str] = None,
        sentiment: Optional[str] = None,
        limit: Optional[int] = None
    ) -> pd.DataFrame:
        df = self.df
        if platform and platform.lower() != "all" and 'platform' in df.columns:
            df = df[df['platform'].str.lower() == platform.lower()]
        if brand and brand.lower() != "all" and 'brand_name' in df.columns:
            df = df[df['brand_name'].str.lower() == brand.lower()]
        if sentiment and sentiment.lower() != "all" and 'sentiment_label' in df.columns:
            df = df[df['sentiment_label'].str.lower() == sentiment.lower()]
        if limit:
            df = df.head(limit)
        return df