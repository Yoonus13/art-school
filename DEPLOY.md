# Vercel 배포 체크리스트

## 가장 쉬운 방법: GitHub 연결

- [ ] 프로젝트 압축 해제
- [ ] GitHub 새 저장소 생성
- [ ] 프로젝트 파일 전체 업로드
- [ ] Vercel 로그인
- [ ] Add New → Project
- [ ] 해당 GitHub 저장소 Import
- [ ] Framework Preset: Next.js
- [ ] Root Directory: 프로젝트 루트
- [ ] Build Command: `next build` 또는 기본값
- [ ] Install Command: `npm install` 또는 기본값
- [ ] Deploy 클릭

환경변수는 필요하지 않습니다.

## 배포 후 확인

- [ ] 종합 현황 KPI 표시
- [ ] 기준연도 변경
- [ ] 지역·설립구분 필터
- [ ] 대학별 상세
- [ ] 대학 비교
- [ ] 데이터 품질 화면
- [ ] CSV 다운로드
- [ ] 모바일 화면

## 직접 배포할 수 없는 이유

Vercel 계정 로그인과 GitHub 저장소 권한은 사용자 본인 인증이 필요합니다.
프로젝트 자체는 Vercel에서 바로 빌드되도록 구성되어 있습니다.
