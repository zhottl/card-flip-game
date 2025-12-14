# Vercel 배포 가이드

## 환경 변수 설정 방법

### 1. Vercel 대시보드에서 설정

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings** → **Environment Variables** 클릭
4. 다음 환경 변수 추가:

   | Name | Value |
   |------|-------|
   | `SUPABASE_URL` | `https://jtmsuvpqxphytjurqase.supabase.co` |
   | `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

5. **Environment** 선택:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (선택사항)

6. **Save** 클릭

### 2. 빌드 시 환경 변수 주입

Vercel은 빌드 시 환경 변수를 HTML에 주입합니다. 
현재 코드는 `window.SUPABASE_URL`과 `window.SUPABASE_ANON_KEY`를 사용하도록 설정되어 있습니다.

### 3. 배포 후 확인

배포 후 브라우저 콘솔에서 다음을 확인:
```javascript
console.log(window.SUPABASE_URL);
console.log(window.SUPABASE_ANON_KEY);
```

값이 올바르게 설정되어 있는지 확인하세요.

## 문제 해결

### 환경 변수가 주입되지 않는 경우

정적 사이트에서는 빌드 타임에 환경 변수를 주입해야 합니다. 

**대안 방법 1: vercel.json 사용**
- `vercel.json` 파일이 이미 생성되어 있습니다
- 빌드 스크립트를 추가하여 환경 변수를 주입할 수 있습니다

**대안 방법 2: 빌드 스크립트 추가**
`package.json`에 빌드 스크립트를 추가:
```json
{
  "scripts": {
    "build": "node build.js"
  }
}
```

`build.js` 파일 생성:
```javascript
const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const replaced = indexHtml
  .replace('%SUPABASE_URL%', supabaseUrl)
  .replace('%SUPABASE_ANON_KEY%', supabaseKey);

fs.writeFileSync(path.join(__dirname, 'index.html'), replaced);
```

**대안 방법 3: 간단한 Node.js 스크립트**
더 간단하게, `index.html`을 직접 수정하는 스크립트를 만들 수 있습니다.

## 현재 설정

현재 코드는 다음 순서로 환경 변수를 찾습니다:
1. `window.SUPABASE_URL` / `window.SUPABASE_ANON_KEY` (Vercel에서 주입)
2. 기본값 (로컬 개발용)

로컬에서는 `supabase-config.js` 파일을 사용하고, 
Vercel에서는 환경 변수를 사용합니다.

