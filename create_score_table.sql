-- 카드 뒤집기 게임 점수 테이블 생성
CREATE TABLE IF NOT EXISTS card_flip_scores (
  id BIGSERIAL PRIMARY KEY,
  player_name VARCHAR(100) NOT NULL,
  moves INTEGER NOT NULL,
  time_taken INTEGER NOT NULL, -- 초 단위
  score INTEGER, -- 점수 (낮을수록 좋음: moves * 10 + time_taken)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_card_flip_scores_score ON card_flip_scores(score ASC);
CREATE INDEX IF NOT EXISTS idx_card_flip_scores_created_at ON card_flip_scores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_card_flip_scores_player_name ON card_flip_scores(player_name);

-- RLS (Row Level Security) 활성화
ALTER TABLE card_flip_scores ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 정책 생성
CREATE POLICY "Allow public read access" ON card_flip_scores
    FOR SELECT
    USING (true);

-- 모든 사용자가 삽입할 수 있도록 정책 생성
CREATE POLICY "Allow public insert access" ON card_flip_scores
    FOR INSERT
    WITH CHECK (true);

-- 상위 10개 점수 조회 함수 (선택사항)
CREATE OR REPLACE FUNCTION get_top_scores(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id BIGINT,
    player_name VARCHAR,
    moves INTEGER,
    time_taken INTEGER,
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cfs.id,
        cfs.player_name,
        cfs.moves,
        cfs.time_taken,
        cfs.score,
        cfs.created_at
    FROM card_flip_scores cfs
    ORDER BY cfs.score ASC, cfs.time_taken ASC, cfs.moves ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

