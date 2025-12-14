// Supabase 설정 예제 파일
// 이 파일을 복사하여 supabase-config.js로 이름을 변경하고 실제 키를 입력하세요.

const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};

// Supabase 클라이언트 초기화
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

