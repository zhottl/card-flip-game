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
    const scriptTag = `
    <script>
        // Vercel 환경 변수 주입
        window.SUPABASE_URL = '${supabaseUrl}';
        window.SUPABASE_ANON_KEY = '${supabaseAnonKey}';
    </script>`;
    
    // 기존 스크립트 태그를 찾아서 교체
    const scriptPattern = /<!-- Vercel 환경 변수 주입 -->[\s\S]*?<\/script>/;
    if (scriptPattern.test(indexHtml)) {
        indexHtml = indexHtml.replace(scriptPattern, scriptTag.trim());
    } else {
        // 스크립트 태그가 없으면 head 태그 안에 추가
        indexHtml = indexHtml.replace('</head>', `    ${scriptTag}\n</head>`);
    }
    
    console.log('✅ 환경 변수가 주입되었습니다.');
} else {
    console.log('⚠️  환경 변수가 설정되지 않았습니다. 기본값을 사용합니다.');
}

// 수정된 index.html 저장
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✅ 빌드 완료!');

