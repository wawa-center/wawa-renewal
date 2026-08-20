# 와와 학습코칭센터 웹사이트 (wawaedu.kr)

> 이 문서는 이 프로젝트를 처음 보는 사람(및 Claude)이 빠르게 이해하도록 정리한 안내서입니다.

## 한줄 요약
와와 학습코칭센터 공식 웹사이트. **순수 정적 사이트**(HTML/CSS/JS)이며 프레임워크·서버·DB가 없습니다. GitHub Pages로 배포됩니다.

## 기본 정보
- **도메인**: https://wawaedu.kr (가비아에서 도메인 구매 → DNS가 GitHub Pages IP를 가리킴)
- **호스팅/배포**: GitHub Pages. `main` 브랜치에 **push하면 1~2분 뒤 자동 배포**됩니다. (빌드 과정 없음)
- **기술**: 정적 HTML/CSS/JS. 폰트는 Pretendard(CDN), 지도는 Google Maps iframe 임베드(API 키 없이).

## 파일 구조
### 메인 페이지 (루트)
- `index.html` — 홈
- `about.html` — 브랜드 소개
- `learning.html` — 학습 시스템(4C 프로세스)
- `centers.html` — 센터 찾기(지역 필터·검색·지도 팝업) + **상담 신청 폼**
- `reviews.html` — 학습 후기
- `news.html` — 소식·FAQ
- `guide.html` — 학습 가이드(블로그 허브)
- `guide-*.html` — 가이드 글들 (예: `guide-self-directed.html`, `guide-middle-math.html`, `guide-go1-naesin.html`)
- `diagnosis.html` — 학습유형 진단 테스트(순수 JS, 서버 불필요)
- `terms.html`, `privacy.html` — 이용약관/개인정보처리방침 (푸터 링크는 현재 숨김, 파일은 보존)
- `recruit.html` — 교사 채용(현재 메뉴에서 제외됨)

### 자동 생성 페이지
- `c/{센터명}.html` — **지점별 센터 페이지 205개** (SEO용, 한글 파일명)
- `s/{학교명}.html` — **학교별 SEO 페이지 379개** (예: "○○고 영어 과외" 키워드)
- `t/{id}.html` — **방문수업 선생님별 SEO 페이지 707개** (소개·지역·과목·학년·학교·과외 키워드). `assets/js/coaches-data.js`의 코치 데이터로 생성(생성기: scratchpad/gen_teacher_pages.ps1). 방문 선생님은 소개에 학교가 없으면 `centers-data.js` 기반으로 인근 학교를 자동 보강. `visit.html`이 이 데이터로 카드/모달 렌더 + 모달에서 t/ 페이지로 링크.

### 공통 자산
- `assets/css/style.css` — 전체 스타일. 색상·폰트는 상단 `:root` 디자인 토큰에서 관리
- `assets/js/main.js` — 공통 JS(네비 토글, 스크롤 애니메이션, 상담폼 전송)
- `assets/js/centers-data.js` — 센터 205개 데이터 배열 `window.WAWA_CENTERS` (centers.html이 이걸로 카드 렌더링)
- `assets/images/` — 로고·사진·파비콘
- `assets/images/class/{지점명}/` — **수업현황(지점) 사진은 지점별 폴더에 보관** (예: `assets/images/class/탄현점/탄현점1.jpeg`). 파일명은 자유(원본 그대로 OK). 새 지점 사진을 올릴 때는 `assets/images/class/{지점명}/` 폴더를 만들어 넣고, 글·`class-posts.js`에서 그 경로(`../assets/images/class/{지점명}/파일`)로 참조한다.
- `sitemap.xml`, `robots.txt`, `favicon.png`, `favicon.ico`
- `google-apps-script.gs` — 상담폼 백엔드(구글 Apps Script) **참고용 사본** (실제 실행본은 구글 계정 안에 있음)

## 센터/학교 페이지는 어떻게 만들어졌나
- `c/`(센터), `s/`(학교) 페이지는 **내부 엑셀 데이터**(`코칭센터_데이터_*.xlsx`)를 스크립트로 파싱해 **대량 생성**한 것입니다.
- 그 엑셀에는 가격·상담자 등 **비공개 정보**가 있어 `.gitignore`로 저장소에서 제외되어 있습니다(repo에 없음).
- 센터/학교 데이터를 대량 갱신하려면 그 엑셀 원본 + 생성 스크립트가 필요합니다. (개별 페이지 텍스트 수정은 해당 .html 직접 편집으로 가능)

## 외부 연동 (모두 원래 소유자 계정에 있음)
- **구글 애널리틱스 GA4**: `G-G8EBYGRP9K` (전 페이지 `<head>`에 삽입)
- **네이버 서치어드바이저**: 홈 `<head>`에 인증 메타태그
- **상담 신청 폼**(`centers.html`): `data-sheet` 속성의 Google Apps Script 웹앱 URL → 구글 시트에 저장(+텔레그램 알림 옵션)
- **구글 지도**: 각 센터/학교 페이지의 iframe (주소 기반)

## SEO
- 모든 페이지에 `canonical`, Open Graph, 구조화데이터(JSON-LD) 적용
- `sitemap.xml`에 약 595개 URL 등록. **새 페이지를 추가하면 sitemap.xml에도 추가**해야 검색엔진이 인지함.

## 배포 & 흔한 이슈
- `main`에 push → GitHub Pages 자동 배포(1~2분).
- 커밋을 짧은 시간에 여러 번 하면 GitHub에서 **"deploy failed" 메일**이 올 수 있는데 대부분 **일시적**입니다(빈 커밋으로 재배포하거나 다음 push 때 자동 복구).

## 자주 하는 작업 가이드
- **텍스트 수정**: 해당 `.html`에서 직접 수정 → 커밋 → push.
- **가이드(블로그) 새 글**: `guide-새이름.html` 만들고 → `guide.html`의 카드에 링크 연결 → `sitemap.xml`에 URL 추가.
- **지도 핀이 안 맞을 때**: 지도 주소에서 층·호수·건물명·학원명을 빼면 정확해짐(도로명+번호만 남기기).

## ⚠️ 주의사항 (꼭 지킬 것)
- **내부 데이터 엑셀/CSV(`코칭센터_데이터_*.xlsx` 등)는 절대 커밋 금지** — 이미 `.gitignore`에 등록됨. 공개 저장소이므로 가격·개인정보가 노출되면 안 됨.
- **비밀값(텔레그램 봇 토큰 등)을 코드에 넣지 말 것** — 공개 저장소임.
- **센터/학교 페이지 URL은 한글**(예: `/c/하계점.html`). 이미 검색엔진에 색인 중이라 **파일명을 바꾸면 404**가 생김. 이름 변경은 신중히.
