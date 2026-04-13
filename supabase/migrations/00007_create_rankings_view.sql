-- Regional rankings view
CREATE VIEW regional_rankings AS
SELECT
  p.id AS player_id,
  p.full_name,
  p.nickname,
  p.date_of_birth,
  p.position,
  p.city,
  p.state,
  p.region,
  p.avatar_url,
  COALESCE(g.total_gie, 0) AS total_gie,
  COALESCE(c.total_score, 0) AS confidence,
  RANK() OVER (PARTITION BY p.region ORDER BY COALESCE(g.total_gie, 0) DESC) AS region_rank,
  PERCENT_RANK() OVER (PARTITION BY p.region ORDER BY COALESCE(g.total_gie, 0) DESC) AS region_percentile
FROM players p
LEFT JOIN gie_scores g ON g.player_id = p.id
LEFT JOIN confidence_scores c ON c.player_id = p.id
WHERE p.is_active = true
ORDER BY p.region, COALESCE(g.total_gie, 0) DESC;
