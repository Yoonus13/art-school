# 캡스톤 디자인 운영 대시보드 — Vercel 배포용

업로드된 2024년·2025년 캡스톤 디자인 운영 현황을 기반으로 만든 Next.js 대시보드입니다.

## 주요 기능

- 연도·지역·설립구분·학교종류 필터
- 핵심 KPI 및 전년 대비 증감
- 연도별 학생 현황과 지원금 구성
- 이수학생·지원금 상위 대학
- 대학별 상세 현황
- 최대 5개 대학 비교
- 데이터 품질검사
- 현재 조회 결과 CSV 다운로드
- PC·태블릿·모바일 반응형 화면

## 로컬 실행

Node.js 20 이상이 필요합니다.

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## Vercel 대시보드에서 배포

1. 압축을 풀고 전체 프로젝트를 GitHub 저장소에 올립니다.
2. Vercel에서 `Add New → Project`를 선택합니다.
3. GitHub 저장소를 Import합니다.
4. Framework Preset이 `Next.js`인지 확인합니다.
5. 별도 환경변수 없이 Deploy를 누릅니다.

## Vercel CLI로 배포

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

## 데이터 변경

`data/capstone.json`을 변경한 뒤 GitHub에 push하면 연결된 Vercel 프로젝트가 자동 재배포됩니다.

## 참고

현재 버전은 원본 데이터를 정적 JSON으로 포함하므로 별도의 데이터베이스나 환경변수가 필요하지 않습니다.
향후 관리자 업로드, 로그인, 정정 승인 기능을 추가하려면 Vercel Postgres 또는 Supabase 연동을 권장합니다.
