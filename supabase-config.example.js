// Supabase 설정 예제 파일
// 이 파일을 복사하여 supabase-config.js로 이름을 변경하고 실제 키를 입력하세요.
// 또는 Vercel 환경 변수를 사용하세요 (권장)

const SUPABASE_CONFIG = {
    // Vercel 환경 변수 사용 (배포 시)
    // 또는 window 객체를 통해 주입된 값 사용
    url: window.SUPABASE_URL || 'YOUR_SUPABASE_URL',
    anonKey: window.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
};

// Supabase 클라이언트 초기화
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

