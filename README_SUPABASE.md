# Supabase 연동 가이드

## 1. Supabase 프로젝트 생성

1. https://supabase.com 에서 로그인
2. "New Project" 클릭
3. 프로젝트 이름과 데이터베이스 비밀번호 설정
4. 프로젝트 생성 완료

## 2. 프로젝트 참조(ref) 확인

프로젝트 설정(Settings) > General에서 프로젝트 참조(ref)를 확인하세요.

## 3. 테이블 생성

`create_score_table.sql` 파일의 SQL을 Supabase SQL Editor에서 실행하거나, 프로젝트 참조(ref)를 제공하면 자동으로 생성됩니다.

## 4. API 키 설정

1. Supabase 대시보드 > Settings > API
2. Project URL과 anon public key 복사
3. `supabase-config.js` 파일에 입력:
   - `YOUR_SUPABASE_URL` → Project URL
   - `YOUR_SUPABASE_ANON_KEY` → anon public key

## 5. Supabase JS 라이브러리 추가

`index.html`에 다음 스크립트를 추가해야 합니다:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## 6. 사용 방법

게임 완료 시 자동으로 점수가 저장됩니다. 플레이어 이름은 게임 시작 시 입력받습니다.

