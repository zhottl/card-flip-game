// Supabase 설정
const SUPABASE_CONFIG = {
    url: 'https://jtmsuvpqxphytjurqase.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bXN1dnBxeHBoeXRqdXJxYXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NjI3MzYsImV4cCI6MjA4MTIzODczNn0.A75RfWTkmjVQUofBAcR18eYccduYSl8ROV4Cx2kgTNA'
};

// Supabase 클라이언트 초기화
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

