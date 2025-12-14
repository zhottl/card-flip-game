const fs = require('fs');
const path = require('path');

// 환경 변수 가져오기
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// index.html 읽기
const indexHtmlPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 환경 변수가 있으면 주입, 없으면 기본값 유지
if (supabaseUrl && supabaseAnonKey) {
    // 환경 변수를 window 객체에 주입하는 스크립트로 교체
    // 이스케이프 처리
    const escapedUrl = supabaseUrl.replace(/'/g, "\\'");
    const escapedKey = supabaseAnonKey.replace(/'/g, "\\'");
    
    // 환경 변수를 주입하는 스크립트
    const envScript = `        // Vercel 환경 변수 주입 (빌드 시)
        window.SUPABASE_URL = '${escapedUrl}';
        window.SUPABASE_ANON_KEY = '${escapedKey}';
        console.log('✅ 환경 변수가 주입되었습니다.');`;
    
    // 기존 환경 변수 주입 스크립트를 찾아서 교체
    const envScriptPattern = /\/\/ 기본값: 로컬 개발용 또는 환경 변수가 주입되지 않은 경우[\s\S]*?window\.SUPABASE_ANON_KEY = '';[\s\S]*?<\/script>/;
    if (envScriptPattern.test(indexHtml)) {
        indexHtml = indexHtml.replace(
            /if \(typeof window\.SUPABASE_URL === 'undefined'\) \{[\s\S]*?window\.SUPABASE_ANON_KEY = '';[\s\S]*?\}/,
            envScript
        );
    }
    
    console.log('✅ 환경 변수가 주입되었습니다.');
    console.log('URL:', supabaseUrl.substring(0, 30) + '...');
    console.log('Key:', supabaseAnonKey.substring(0, 30) + '...');
} else {
    console.log('⚠️  환경 변수가 설정되지 않았습니다. 기본값을 사용합니다.');
    console.log('SUPABASE_URL:', supabaseUrl ? '설정됨' : '없음');
    console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '설정됨' : '없음');
}

// 수정된 index.html 저장
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✅ 빌드 완료!');

