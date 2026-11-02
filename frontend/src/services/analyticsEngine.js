// Client-side analytics engine & realistic benchmark dataset
// Provides 100% offline & standalone compatibility for Vercel deployments

export const MULTI_CHANNEL_BENCHMARK = {
  total_posts: 12000,
  avg_sentiment: 0.684,
  avg_engagement_rate: 0.2781,
  avg_toxicity: 0.084,
  sentiment_breakdown: {
    Positive: 4839,
    Neutral: 2307,
    Negative: 4854
  },
  platforms_monitored: ["Instagram", "Twitter", "YouTube", "Reddit", "Facebook"],
  brands_tracked: ["Google", "Microsoft", "Nike", "Adidas", "Samsung", "Pepsi", "Apple", "Toyota"],
  active_campaigns: 4,
  kols_identified: 328,
  
  // Timeline (30 days)
  timeline: [
    { timestamp: "2025-04-01", sentiment_score: 0.62, toxicity_score: 0.08, likes_count: 82400, volume: 380 },
    { timestamp: "2025-04-03", sentiment_score: 0.65, toxicity_score: 0.07, likes_count: 89100, volume: 410 },
    { timestamp: "2025-04-05", sentiment_score: 0.71, toxicity_score: 0.05, likes_count: 95400, volume: 430 },
    { timestamp: "2025-04-07", sentiment_score: 0.58, toxicity_score: 0.09, likes_count: 76000, volume: 390 },
    { timestamp: "2025-04-09", sentiment_score: 0.64, toxicity_score: 0.08, likes_count: 84200, volume: 405 },
    { timestamp: "2025-04-11", sentiment_score: 0.69, toxicity_score: 0.06, likes_count: 91300, volume: 420 },
    { timestamp: "2025-04-13", sentiment_score: 0.73, toxicity_score: 0.05, likes_count: 98700, volume: 450 },
    { timestamp: "2025-04-15", sentiment_score: 0.76, toxicity_score: 0.04, likes_count: 104200, volume: 480 },
    { timestamp: "2025-04-17", sentiment_score: 0.68, toxicity_score: 0.07, likes_count: 88500, volume: 415 },
    { timestamp: "2025-04-19", sentiment_score: 0.63, toxicity_score: 0.08, likes_count: 81200, volume: 395 },
    { timestamp: "2025-04-21", sentiment_score: 0.70, toxicity_score: 0.06, likes_count: 93400, volume: 440 },
    { timestamp: "2025-04-23", sentiment_score: 0.75, toxicity_score: 0.05, likes_count: 101000, volume: 465 },
    { timestamp: "2025-04-25", sentiment_score: 0.72, toxicity_score: 0.06, likes_count: 97800, volume: 445 },
    { timestamp: "2025-04-27", sentiment_score: 0.69, toxicity_score: 0.07, likes_count: 91400, volume: 425 },
    { timestamp: "2025-04-29", sentiment_score: 0.74, toxicity_score: 0.05, likes_count: 102500, volume: 470 },
    { timestamp: "2025-04-30", sentiment_score: 0.77, toxicity_score: 0.04, likes_count: 108900, volume: 495 }
  ],
  
  emotions: {
    Joy: 3450,
    Excitement: 2840,
    Curiosity: 2120,
    Confusion: 1680,
    Frustration: 1240,
    Skepticism: 670
  },

  geographic_distribution: {
    "Milan, Italy": 403,
    "Mexico City, Mexico": 399,
    "Dubai, UAE": 384,
    "São Paulo, Brazil": 383,
    "Shanghai, China": 383,
    "Beijing, China": 382,
    "Barcelona, Spain": 380,
    "Munich, Germany": 379,
    "New York, USA": 365,
    "Tokyo, Japan": 352,
    "London, UK": 340,
    "Singapore": 328
  },

  platform_distribution: {
    "YouTube": 2436,
    "Facebook": 2431,
    "Twitter": 2406,
    "Reddit": 2372,
    "Instagram": 2355
  },

  top_categories: {
    "Pricing": 2046,
    "Marketing": 2043,
    "Delivery": 2036,
    "Returns": 1991,
    "Support": 1947,
    "Product Quality": 1937
  },

  trending_hashtags: {
    "Innovation": 3412,
    "TechTrends": 2984,
    "AI": 2750,
    "Food": 2410,
    "Sustainable": 2180,
    "BlackFriday": 1940,
    "Reviews": 1820,
    "MustHave": 1650,
    "Fitness": 1490,
    "Design": 1380,
    "MobileTech": 1240,
    "Launch": 1150
  },

  brand_performance: [
    { brand: "Google", post_count: 1216, avg_sentiment: 0.76, total_likes: 2489000, avg_engagement: 0.312 },
    { brand: "Microsoft", post_count: 1239, avg_sentiment: 0.69, total_likes: 2315000, avg_engagement: 0.285 },
    { brand: "Nike", post_count: 1219, avg_sentiment: 0.81, total_likes: 2940000, avg_engagement: 0.342 },
    { brand: "Adidas", post_count: 1229, avg_sentiment: 0.74, total_likes: 2410000, avg_engagement: 0.298 },
    { brand: "Samsung", post_count: 1216, avg_sentiment: 0.72, total_likes: 2280000, avg_engagement: 0.274 },
    { brand: "Pepsi", post_count: 1199, avg_sentiment: 0.65, total_likes: 1980000, avg_engagement: 0.245 }
  ],

  graph_stats: {
    total_nodes: 2015,
    total_edges: 500,
    network_density: 0.000246,
    avg_degree: 0.5
  },

  top_kols: [
    {
      user_id: "user_g4gwwi8d",
      handle: "@alex_techpulse",
      influence_score: 92.4,
      posts_count: 48,
      total_likes: 194906,
      total_impressions: 955700,
      engagement_growth: 0.441,
      primary_platform: "Instagram",
      category: "Key Opinion Leader"
    },
    {
      user_id: "user_zor97nv5",
      handle: "@sophia_ai_trends",
      influence_score: 89.7,
      posts_count: 42,
      total_likes: 168400,
      total_impressions: 880410,
      engagement_growth: 0.476,
      primary_platform: "Instagram",
      category: "Key Opinion Leader"
    },
    {
      user_id: "user_h748lmtz",
      handle: "@marcus_bytes",
      influence_score: 86.0,
      posts_count: 39,
      total_likes: 154895,
      total_impressions: 739810,
      engagement_growth: 0.481,
      primary_platform: "Twitter",
      category: "Key Opinion Leader"
    },
    {
      user_id: "user_ugd6vymw",
      handle: "@elena_designlab",
      influence_score: 84.5,
      posts_count: 36,
      total_likes: 144662,
      total_impressions: 699307,
      engagement_growth: 0.449,
      primary_platform: "Reddit",
      category: "Key Opinion Leader"
    },
    {
      user_id: "user_i59rr7m0",
      handle: "@david_crypto_vision",
      influence_score: 82.4,
      posts_count: 31,
      total_likes: 134788,
      total_impressions: 599236,
      engagement_growth: 0.379,
      primary_platform: "Facebook",
      category: "Key Opinion Leader"
    },
    {
      user_id: "user_j82kd91m",
      handle: "@tech_frontier",
      influence_score: 79.8,
      posts_count: 28,
      total_likes: 112400,
      total_impressions: 480100,
      engagement_growth: 0.355,
      primary_platform: "YouTube",
      category: "Key Opinion Leader"
    }
  ],

  nodes: [
    { id: "user_g4gwwi8d", label: "@alex_techpulse", group: 1, size: 28, score: 92.4 },
    { id: "user_zor97nv5", label: "@sophia_ai_trends", group: 1, size: 26, score: 89.7 },
    { id: "user_h748lmtz", label: "@marcus_bytes", group: 1, size: 24, score: 86.0 },
    { id: "user_ugd6vymw", label: "@elena_designlab", group: 1, size: 22, score: 84.5 },
    { id: "user_i59rr7m0", label: "@david_crypto_vision", group: 1, size: 20, score: 82.4 },
    { id: "user_j82kd91m", label: "@tech_frontier", group: 1, size: 18, score: 79.8 },
    { id: "@google_devs", label: "@google_devs", group: 2, size: 16, score: 70.0 },
    { id: "@meta_ai", label: "@meta_ai", group: 2, size: 16, score: 68.0 },
    { id: "@nike_running", label: "@nike_running", group: 2, size: 15, score: 65.0 },
    { id: "@tech_insider", label: "@tech_insider", group: 2, size: 14, score: 62.0 },
    { id: "@design_systems", label: "@design_systems", group: 2, size: 14, score: 60.0 },
    { id: "@future_gadgets", label: "@future_gadgets", group: 2, size: 12, score: 58.0 }
  ]
};

export const INSTAGRAM_BENCHMARK = {
  total_posts: 29999,
  avg_sentiment: 0.742,
  avg_engagement_rate: 0.0421,
  avg_toxicity: 0.038,
  sentiment_breakdown: {
    Positive: 16420,
    Neutral: 9210,
    Negative: 4369
  },
  platforms_monitored: ["Instagram Reels", "Instagram Carousels", "Instagram Images"],
  brands_tracked: ["Fashion", "Photography", "Technology", "Lifestyle", "Fitness", "Food", "Music"],
  active_campaigns: 6,
  kols_identified: 540,

  timeline: [
    { timestamp: "2025-05-01", sentiment_score: 0.72, toxicity_score: 0.04, likes_count: 275000, volume: 980 },
    { timestamp: "2025-05-05", sentiment_score: 0.75, toxicity_score: 0.03, likes_count: 298000, volume: 1040 },
    { timestamp: "2025-05-10", sentiment_score: 0.79, toxicity_score: 0.03, likes_count: 324000, volume: 1120 },
    { timestamp: "2025-05-15", sentiment_score: 0.73, toxicity_score: 0.04, likes_count: 289000, volume: 990 },
    { timestamp: "2025-05-20", sentiment_score: 0.77, toxicity_score: 0.03, likes_count: 312000, volume: 1080 },
    { timestamp: "2025-05-25", sentiment_score: 0.81, toxicity_score: 0.02, likes_count: 345000, volume: 1190 },
    { timestamp: "2025-05-30", sentiment_score: 0.83, toxicity_score: 0.02, likes_count: 362000, volume: 1240 }
  ],

  emotions: {
    Joy: 9820,
    Excitement: 8430,
    Inspiration: 5910,
    Curiosity: 3410,
    Neutral: 1840,
    Frustration: 589
  },

  geographic_distribution: {
    "Los Angeles, USA": 1840,
    "London, UK": 1690,
    "Paris, France": 1540,
    "Tokyo, Japan": 1420,
    "Milan, Italy": 1390,
    "Sydney, Australia": 1280,
    "Dubai, UAE": 1240,
    "São Paulo, Brazil": 1190
  },

  platform_distribution: {
    "Single Image": 11927,
    "Carousel": 10627,
    "Reel": 7445
  },

  top_categories: {
    "Photography": 3035,
    "Fashion": 3034,
    "Technology": 3025,
    "Lifestyle": 3017,
    "Food & Dining": 3010,
    "Fitness & Health": 3004,
    "Music & Arts": 3003,
    "Travel & Nature": 2968
  },

  trending_hashtags: {
    "InstaReels": 7820,
    "CreatorEconomy": 6410,
    "FashionWeek": 5940,
    "TechGadgets": 5320,
    "FitnessMotivation": 4890,
    "TravelDiaries": 4450,
    "FoodieLife": 4120,
    "PhotographyDaily": 3890,
    "ViralContent": 3610,
    "AestheticVibes": 3280
  },

  brand_performance: [
    { brand: "Photography", post_count: 3035, avg_sentiment: 0.82, total_likes: 912000, avg_engagement: 0.048 },
    { brand: "Fashion", post_count: 3034, avg_sentiment: 0.79, total_likes: 945000, avg_engagement: 0.052 },
    { brand: "Technology", post_count: 3025, avg_sentiment: 0.76, total_likes: 884000, avg_engagement: 0.041 },
    { brand: "Lifestyle", post_count: 3017, avg_sentiment: 0.78, total_likes: 896000, avg_engagement: 0.044 },
    { brand: "Fitness", post_count: 3004, avg_sentiment: 0.84, total_likes: 978000, avg_engagement: 0.056 },
    { brand: "Food", post_count: 3010, avg_sentiment: 0.81, total_likes: 924000, avg_engagement: 0.046 }
  ],

  graph_stats: {
    total_nodes: 3410,
    total_edges: 1840,
    network_density: 0.000315,
    avg_degree: 1.08
  },

  top_kols: [
    {
      user_id: "ig_creator_20",
      handle: "@fit_with_sophia",
      influence_score: 96.8,
      posts_count: 142,
      total_likes: 844900,
      total_impressions: 4826800,
      engagement_growth: 0.663,
      primary_platform: "Instagram (Creator)",
      category: "Viral Key Opinion Leader"
    },
    {
      user_id: "ig_brand_15",
      handle: "@luxe_beauty_lab",
      influence_score: 94.2,
      posts_count: 118,
      total_likes: 624100,
      total_impressions: 3616000,
      engagement_growth: 0.531,
      primary_platform: "Instagram (Brand)",
      category: "Top Tier Brand"
    },
    {
      user_id: "ig_creator_19",
      handle: "@gourmet_explorers",
      influence_score: 91.5,
      posts_count: 98,
      total_likes: 541000,
      total_impressions: 2971000,
      engagement_growth: 0.584,
      primary_platform: "Instagram (Creator)",
      category: "Viral Key Opinion Leader"
    },
    {
      user_id: "ig_creator_11",
      handle: "@cyber_tech_now",
      influence_score: 88.6,
      posts_count: 84,
      total_likes: 472000,
      total_impressions: 2436000,
      engagement_growth: 0.657,
      primary_platform: "Instagram (Creator)",
      category: "High Influence"
    }
  ],

  nodes: [
    { id: "ig_creator_20", label: "@fit_with_sophia", group: 1, size: 30, score: 96.8 },
    { id: "ig_brand_15", label: "@luxe_beauty_lab", group: 1, size: 28, score: 94.2 },
    { id: "ig_creator_19", label: "@gourmet_explorers", group: 1, size: 26, score: 91.5 },
    { id: "ig_creator_11", label: "@cyber_tech_now", group: 1, size: 24, score: 88.6 },
    { id: "@reels_trends", label: "@reels_trends", group: 2, size: 16, score: 72.0 },
    { id: "@fashion_weekly", label: "@fashion_weekly", group: 2, size: 15, score: 68.0 },
    { id: "@explore_hub", label: "@explore_hub", group: 2, size: 14, score: 65.0 },
    { id: "@creators_guild", label: "@creators_guild", group: 2, size: 12, score: 60.0 }
  ]
};

export const POSTS_DATA_LAKE = [
  {
    post_id: "kcqbs6hxybia",
    platform: "Instagram",
    user_id: "user_52nwb0a6",
    text_content: "Just tried the Chromebook from Google. Best purchase ever. #Food Really interested in hearing your thoughts!",
    brand_name: "Google",
    sentiment_label: "Positive",
    sentiment_score: 0.982,
    emotion_type: "Excited",
    likes_count: 1264,
    location: "Melbourne, Australia",
    topic_category: "Pricing"
  },
  {
    post_id: "vkmervg4ioos",
    platform: "Twitter",
    user_id: "user_ucryct98",
    text_content: "Just saw an ad for Microsoft Surface Laptop during the SpringBlast2025. Not worth the money. #MustHave #Tech",
    brand_name: "Microsoft",
    sentiment_label: "Negative",
    sentiment_score: -0.379,
    emotion_type: "Frustrated",
    likes_count: 522,
    location: "Tokyo, Japan",
    topic_category: "Delivery"
  },
  {
    post_id: "memhx4o1x6yu",
    platform: "Reddit",
    user_id: "user_7rrev126",
    text_content: "What's your opinion about Nike's Epic React? #Promo #Trending Really interested in hearing community benchmarks!",
    brand_name: "Nike",
    sentiment_label: "Positive",
    sentiment_score: 0.659,
    emotion_type: "Curious",
    likes_count: 2689,
    location: "Beijing, China",
    topic_category: "Product Quality"
  },
  {
    post_id: "bhyo6piijqt9",
    platform: "YouTube",
    user_id: "user_4mxuq0ax",
    text_content: "Bummed out with my new Diet Pepsi shipment from Pepsi! Disappointed with the quality and delivery delay. #Reviews",
    brand_name: "Pepsi",
    sentiment_label: "Negative",
    sentiment_score: -0.728,
    emotion_type: "Angry",
    likes_count: 1827,
    location: "Lagos, Nigeria",
    topic_category: "Delivery"
  },
  {
    post_id: "c9dkiomowakt",
    platform: "Twitter",
    user_id: "user_l1vpox2k",
    text_content: "Just test-drove the Corolla from Toyota. Absolutely loving it. #Health #Travel Really glad I took the test drive!",
    brand_name: "Toyota",
    sentiment_label: "Positive",
    sentiment_score: 0.546,
    emotion_type: "Joy",
    likes_count: 2005,
    location: "Berlin, Germany",
    topic_category: "Product Quality"
  },
  {
    post_id: "IG0000001",
    platform: "Instagram Reel",
    user_id: "creator_tech_07",
    text_content: "Testing the newest AI photo enhancement on high-tier flagship devices! The dynamic range is wild. #TechTrends #Photography",
    brand_name: "Technology",
    sentiment_label: "Positive",
    sentiment_score: 0.884,
    emotion_type: "Joy",
    likes_count: 4327,
    location: "San Francisco, USA",
    topic_category: "Technology"
  },
  {
    post_id: "IG0000002",
    platform: "Instagram Image",
    user_id: "creator_fit_20",
    text_content: "Morning HIIT session complete! Consistency beats motivation every single day. #FitnessMotivation #Lifestyle",
    brand_name: "Fitness",
    sentiment_label: "Positive",
    sentiment_score: 0.941,
    emotion_type: "Excited",
    likes_count: 7451,
    location: "Los Angeles, USA",
    topic_category: "Fitness & Health"
  },
  {
    post_id: "IG0000003",
    platform: "Instagram Carousel",
    user_id: "creator_food_19",
    text_content: "Authentic sourdough crust tutorial: 72-hour cold fermentation step-by-step breakdown! #FoodieLife #Baking",
    brand_name: "Food",
    sentiment_label: "Positive",
    sentiment_score: 0.912,
    emotion_type: "Inspiration",
    likes_count: 5018,
    location: "Rome, Italy",
    topic_category: "Food & Dining"
  },
  {
    post_id: "IG0000004",
    platform: "Instagram Reel",
    user_id: "creator_fashion_15",
    text_content: "Autumn capsule wardrobe styling guide: 5 essential coats you can style in 20 different outfits! #FashionWeek #Aesthetic",
    brand_name: "Fashion",
    sentiment_label: "Positive",
    sentiment_score: 0.875,
    emotion_type: "Joy",
    likes_count: 6230,
    location: "Paris, France",
    topic_category: "Fashion"
  },
  {
    post_id: "fb_rev_88921",
    platform: "Facebook",
    user_id: "user_p9011mk",
    text_content: "Adidas Ultraboost 5 light review: incredible cushioning on 10k road runs, worth every penny! #AdidasRunning",
    brand_name: "Adidas",
    sentiment_label: "Positive",
    sentiment_score: 0.812,
    emotion_type: "Joy",
    likes_count: 1420,
    location: "London, UK",
    topic_category: "Product Quality"
  },
  {
    post_id: "tw_pulse_4412",
    platform: "Twitter",
    user_id: "user_k00192a",
    text_content: "Customer support resolved my billing issue in under 5 minutes. Major kudos to the team! #CustomerFirst",
    brand_name: "Google",
    sentiment_label: "Positive",
    sentiment_score: 0.785,
    emotion_type: "Joy",
    likes_count: 980,
    location: "Toronto, Canada",
    topic_category: "Support"
  },
  {
    post_id: "rd_disc_33110",
    platform: "Reddit",
    user_id: "user_m9921zx",
    text_content: "Anyone else experiencing Bluetooth audio dropouts after the latest firmware patch on the Surface Headphones?",
    brand_name: "Microsoft",
    sentiment_label: "Neutral",
    sentiment_score: -0.05,
    emotion_type: "Curious",
    likes_count: 450,
    location: "Seattle, USA",
    topic_category: "Support"
  }
];

export const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    campaign_name: "BlackFriday Global Launch",
    platform: "Instagram",
    engagement_rate: 0.182,
    sentiment_score: 0.78
  },
  {
    id: 2,
    campaign_name: "SpringBlast 2025 Tech Showcase",
    platform: "Twitter",
    engagement_rate: 0.124,
    sentiment_score: 0.65
  },
  {
    id: 3,
    campaign_name: "Summer Creator Blitz",
    platform: "YouTube",
    engagement_rate: 0.221,
    sentiment_score: 0.84
  },
  {
    id: 4,
    campaign_name: "Eco-Friendly Brand Wave",
    platform: "Reddit",
    engagement_rate: 0.156,
    sentiment_score: 0.71
  }
];

// Helper to filter benchmark dynamically
export function filterBenchmarkData(baseData, platform = "all", brand = "all") {
  let filtered = { ...baseData };
  
  if (platform !== "all") {
    filtered.platforms_monitored = [platform];
    filtered.total_posts = Math.round(baseData.total_posts * 0.22);
  }
  
  if (brand !== "all") {
    filtered.brands_tracked = [brand];
    filtered.total_posts = Math.round((filtered.total_posts || baseData.total_posts) * 0.18);
  }
  
  return filtered;
}

// Generate realistic live streaming pulses
const LIVE_SAMPLES = [
  { platform: "Instagram", user: "@charlotte_creator", brand: "Nike", content: "Unboxing the newest Pegasus 41! Cushioning is out of this world.", sentiment: "Positive", score: 0.92, emotion: "Joy", location: "London, UK" },
  { platform: "Twitter", user: "@tech_enthusiast", brand: "Google", content: "The new Gemini integration in Android is remarkably fast.", sentiment: "Positive", score: 0.87, emotion: "Excited", location: "San Jose, USA" },
  { platform: "Reddit", user: "@audio_guru99", brand: "Microsoft", content: "Battery life test after 4 weeks: solid 14 hours on normal workload.", sentiment: "Positive", score: 0.64, emotion: "Satisfied", location: "Sydney, Australia" },
  { platform: "YouTube", user: "@gadget_reviews_daily", brand: "Samsung", content: "Is the new display refresh rate worth upgrading? Detailed breakdown.", sentiment: "Neutral", score: 0.12, emotion: "Curious", location: "Seoul, South Korea" },
  { platform: "Instagram Reel", user: "@travel_with_leo", brand: "Lifestyle", content: "Sunset drone view over the Amalfi coast! Shot on mobile in 4K 60fps.", sentiment: "Positive", score: 0.98, emotion: "Joy", location: "Naples, Italy" },
  { platform: "Twitter", user: "@sarah_designs", brand: "Product Quality", content: "The new packaging is 100% biodegradable cardboard. Love this direction!", sentiment: "Positive", score: 0.89, emotion: "Excited", location: "Berlin, Germany" },
  { platform: "Facebook", user: "@david_consumer", brand: "Pepsi", content: "Delivery was 2 hours late and box was dented. Customer support took care of it though.", sentiment: "Neutral", score: -0.15, emotion: "Frustrated", location: "Chicago, USA" }
];

export function generateSimulatedPulse() {
  const sample = LIVE_SAMPLES[Math.floor(Math.random() * LIVE_SAMPLES.length)];
  const randomLikes = Math.floor(Math.random() * 800) + 120;
  
  return {
    post_id: `live_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    user_id: sample.user,
    platform: sample.platform,
    content: sample.content,
    sentiment_label: sample.sentiment,
    sentiment_score: sample.score,
    emotion_type: sample.emotion,
    likes_count: randomLikes,
    location: sample.location,
    timestamp: new Date().toLocaleTimeString()
  };
}

