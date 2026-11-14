# 보안 업데이트

기존 프로젝트의 버전:

```json
"next": "15.5.2",
"react": "19.1.1",
"react-dom": "19.1.1"
```

수정된 버전:

```json
"next": "15.5.29",
"react": "19.3.1",
"react-dom": "19.3.1"
```

## Vercel 재배포 방법

기존 GitHub 저장소를 사용하는 경우 수정된 파일 전체를 덮어쓴 후 push하세요.

```bash
git add .
git commit -m "security: update Next.js and React"
git push
```

Vercel에서 수동 재배포할 경우:

1. Deployments 메뉴로 이동
2. 최신 배포 오른쪽 메뉴 선택
3. Redeploy 선택
4. 가능하면 기존 Build Cache를 사용하지 않고 재배포

기존 프로젝트에 `package-lock.json`이 있다면 다음 명령으로 다시 생성하는 것을 권장합니다.

```bash
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

Windows PowerShell:

```powershell
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm install
npm run build
```
