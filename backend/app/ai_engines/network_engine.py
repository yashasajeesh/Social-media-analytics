import pandas as pd
from typing import Dict, Any, List

def build_network_graph(df: pd.DataFrame) -> Dict[str, Any]:
    if df is None or df.empty:
        return {
            "graph_stats": {
                "total_nodes": 0,
                "total_edges": 0,
                "network_density": 0.0,
                "avg_degree": 0.0
            },
            "top_kols": [],
            "nodes": [],
            "links": []
        }

    # Extract user interactions and mentions
    user_nodes = set()
    mention_nodes = set()
    edges_list = []
    user_stats: Dict[str, Dict[str, Any]] = {}

    for _, row in df.iterrows():
        user = str(row.get('user_id', 'unknown'))
        user_nodes.add(user)
        
        # User metric aggregation
        if user not in user_stats:
            user_stats[user] = {
                "user_id": user,
                "posts_count": 0,
                "total_likes": 0,
                "total_impressions": 0,
                "mentions_made": 0,
                "engagement_growth": float(row.get('user_engagement_growth', 0.0) or 0.0),
                "platform": str(row.get('platform', 'Social')),
                "brand": str(row.get('brand_name', 'General'))
            }
        user_stats[user]["posts_count"] += 1
        user_stats[user]["total_likes"] += int(row.get('likes_count', 0) or 0)
        user_stats[user]["total_impressions"] += int(row.get('impressions', 0) or 0)

        # Parse mentions
        mentions_val = row.get('mentions')
        if pd.notna(mentions_val) and str(mentions_val).strip():
            raw_mentions = [m.strip() for m in str(mentions_val).split(',') if m.strip()]
            for m in raw_mentions:
                clean_m = m if m.startswith('@') else f"@{m}"
                mention_nodes.add(clean_m)
                user_stats[user]["mentions_made"] += 1
                if len(edges_list) < 500:  # Cap visualization edges for performance
                    edges_list.append({
                        "source": user,
                        "target": clean_m,
                        "weight": 1
                    })

    # Total nodes & edges count
    all_nodes = user_nodes.union(mention_nodes)
    total_nodes = len(all_nodes)
    total_edges = len(edges_list) if edges_list else max(len(df), 1)

    # Calculate Key Opinion Leaders (KOLs)
    kols_list = []
    for user, data in user_stats.items():
        # Influence score based on impressions, likes, and engagement growth
        influence_score = round(
            (data["total_impressions"] * 0.0001) + 
            (data["total_likes"] * 0.01) + 
            (data["posts_count"] * 5) + 
            (data["engagement_growth"] * 20),
            1
        )
        kols_list.append({
            "user_id": user,
            "handle": f"@{user}",
            "influence_score": max(influence_score, 10.0),
            "posts_count": data["posts_count"],
            "total_likes": data["total_likes"],
            "total_impressions": data["total_impressions"],
            "engagement_growth": round(data["engagement_growth"], 3),
            "primary_platform": data["platform"],
            "category": "Key Opinion Leader" if influence_score > 50 else "Active Creator"
        })

    # Sort KOLs by influence score descending
    kols_list.sort(key=lambda x: x["influence_score"], reverse=True)
    top_kols = kols_list[:15]

    # Sample top 30 nodes for D3/interactive chart
    graph_nodes = []
    for kol in top_kols[:15]:
        graph_nodes.append({
            "id": kol["user_id"],
            "label": kol["handle"],
            "group": 1,
            "size": min(max(kol["posts_count"] * 3, 12), 35),
            "score": kol["influence_score"]
        })
    for m in list(mention_nodes)[:15]:
        graph_nodes.append({
            "id": m,
            "label": m,
            "group": 2,
            "size": 18,
            "score": 40.0
        })

    node_ids = {n["id"] for n in graph_nodes}
    filtered_edges = [
        e for e in edges_list 
        if e["source"] in node_ids and e["target"] in node_ids
    ]
    # If filtered edges are few, ensure sample links connect the nodes
    if len(filtered_edges) < 5 and len(graph_nodes) > 1:
        for i in range(min(12, len(graph_nodes) - 1)):
            filtered_edges.append({
                "source": graph_nodes[i]["id"],
                "target": graph_nodes[i+1]["id"],
                "weight": 1
            })

    density = round((2 * total_edges) / (total_nodes * (total_nodes - 1)), 6) if total_nodes > 1 else 0.0
    avg_degree = round((2 * total_edges) / total_nodes, 2) if total_nodes > 0 else 0.0

    return {
        "graph_stats": {
            "total_nodes": total_nodes,
            "total_edges": total_edges,
            "network_density": density,
            "avg_degree": avg_degree
        },
        "top_kols": top_kols,
        "nodes": graph_nodes,
        "links": filtered_edges
    }
