# 카드 뒤집기 게임 (Canvas API)

HTML5 Canvas API와 순수 JavaScript로 구현한 카드 뒤집기 게임입니다.

## 기능

- 🎮 Canvas API를 사용한 부드러운 애니메이션
- 🎯 카드 뒤집기 효과
- ⏱️ 실시간 타이머
- 📊 이동 횟수 추적
- 🎉 게임 완료 감지

## 실행 방법

1. `index.html` 파일을 브라우저에서 열기
2. 카드를 클릭하여 뒤집기
3. 같은 기호의 카드 두 장을 찾아 매칭
4. 모든 카드를 매칭하면 게임 완료!

## 기술 스택

- HTML5 Canvas API
- 순수 JavaScript (ES6+)
- CSS3

## 게임 규칙

1. 4x4 그리드에 총 16장의 카드가 배치됩니다
2. 각 기호는 2장씩 총 8쌍이 있습니다
3. 카드를 클릭하여 뒤집고, 같은 기호를 찾아 매칭하세요
4. 모든 카드를 매칭하면 게임에서 승리합니다!

## 설정 방법

### Supabase 설정

1. `supabase-config.example.js` 파일을 복사하여 `supabase-config.js`로 이름을 변경하세요.
2. `supabase-config.js` 파일을 열고 실제 Supabase 프로젝트 정보를 입력하세요:
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'YOUR_SUPABASE_URL',
       anonKey: 'YOUR_SUPABASE_ANON_KEY'
   };
   ```

**중요**: `supabase-config.js` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다. 실제 키는 절대 공개 저장소에 올리지 마세요!

