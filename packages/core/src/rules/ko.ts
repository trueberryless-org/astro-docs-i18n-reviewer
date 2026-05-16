import type { LanguageRule } from "../types.js";

export const koRules: LanguageRule = {
  locale: "ko",
  guideUrl:
    "https://github.com/withastro/docs/blob/main/i18n-guides/%ED%95%9C%EA%B5%AD%EC%96%B4.md",
  patterns: [
    // ── Structure ────────────────────────────────────────────────────────────
    {
      regex: /\[.*?\]\(\/en\/.*?\)/g,
      message:
        "Internal link to `/en/` found — please update it to `/ko/`.",
    },
    {
      regex: /:::(?:노트|팁|주의|경고|위험)\b/g,
      message:
        "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
    },

    // ── Glossary terms ────────────────────────────────────────────────────────
    {
      regex: /\bchangelog\b/gi,
      message:
        "`changelog` should be translated to `변경 로그`.",
      suggestion: "변경 로그",
    },
    {
      regex: /\bclient-side\b/gi,
      message:
        "`client-side` should be translated to `클라이언트 측`.",
      suggestion: "클라이언트 측",
    },
    {
      regex: /\bserver-side\b/gi,
      message:
        "`server-side` should be translated to `서버 측`.",
      suggestion: "서버 측",
    },
    {
      regex: /\bview transitions\b/gi,
      message:
        "`view transitions` should be translated to `뷰 전환`.",
      suggestion: "뷰 전환",
    },
    {
      regex: /\brouting\b/gi,
      message:
        "`routing` should be translated to `라우팅`.",
      suggestion: "라우팅",
    },
    {
      regex: /\bhydration\b/gi,
      message:
        "`hydration` should be translated to `하이드레이션`.",
      suggestion: "하이드레이션",
    },
    {
      regex: /\brepository\b/gi,
      message:
        "`repository` should be translated to `리포지토리`.",
      suggestion: "리포지토리",
    },
    {
      regex: /\btroubleshooting\b/gi,
      message:
        "`troubleshooting` should be translated to `문제 해결`.",
      suggestion: "문제 해결",
    },
    {
      regex: /\bdirectives?\b/gi,
      message:
        "`directive` should be translated to `지시어`.",
      suggestion: "지시어",
    },
    {
      regex: /\btype safe\b/gi,
      message:
        "`type safe` should be translated to `타입 안전`.",
      suggestion: "타입 안전",
    },
    {
      regex: /\bfrontmatter\b/gi,
      message:
        "`frontmatter` should be translated to `프런트매터`.",
      suggestion: "프런트매터",
    },
    {
      regex: /\bcontent collections?\b/gi,
      message:
        "`content collections` should be translated to `콘텐츠 컬렉션`.",
      suggestion: "콘텐츠 컬렉션",
    },
    {
      regex: /\bdependenc(?:y|ies)\b/gi,
      message:
        "`dependency/dependencies` should be translated to `의존성`.",
      suggestion: "의존성",
    },
    {
      regex: /\bconfiguration\b/gi,
      message:
        "`configuration` should be translated to `구성`.",
      suggestion: "구성",
    },
    {
      regex: /\bdirector(?:y|ies)\b/gi,
      message:
        "`directory` should be translated to `디렉터리`.",
      suggestion: "디렉터리",
    },
    {
      regex: /\bfrontend\b/gi,
      message:
        "`frontend` should be translated to `프런트엔드`.",
      suggestion: "프런트엔드",
    },
    {
      regex: /\bfragment\b/gi,
      message:
        "`fragment` should be translated to `프래그먼트`.",
      suggestion: "프래그먼트",
    },
    {
      regex: /\bheader\b/gi,
      message:
        "`header` should be translated to `헤더`.",
      suggestion: "헤더",
    },
    {
      regex: /\bfooter\b/gi,
      message:
        "`footer` should be translated to `푸터`.",
      suggestion: "푸터",
    },
    {
      regex: /\bhook\b/gi,
      message:
        "`hook` should be translated to `훅`.",
      suggestion: "훅",
    },
    {
      regex: /\bisland\b/gi,
      message:
        "`island` (in the Astro Islands context) should be translated to `아일랜드`.",
      suggestion: "아일랜드",
    },
    {
      regex: /\bon-demand\b/gi,
      message:
        "`on-demand` should be translated to `요청 시`.",
      suggestion: "요청 시",
    },
    {
      regex: /\bplaceholder\b/gi,
      message:
        "`placeholder` should be translated to `자리 표시자`.",
      suggestion: "자리 표시자",
    },
    {
      regex: /\bredirect\b/gi,
      message:
        "`redirect` should be translated to `리디렉션`.",
      suggestion: "리디렉션",
    },
    {
      regex: /\brelease\b/gi,
      message:
        "`release` should be translated to `릴리스`.",
      suggestion: "릴리스",
    },
    {
      regex: /\btoolbar\b/gi,
      message:
        "`toolbar` should be translated to `도구 모음`.",
      suggestion: "도구 모음",
    },
    {
      regex: /\baccessibility\b/gi,
      message:
        "`accessibility` should be translated to `접근성`.",
      suggestion: "접근성",
    },
    {
      regex: /\bdeployment\b/gi,
      message:
        "`deployment` should be translated to `배포`.",
      suggestion: "배포",
    },
    {
      regex: /\bintegrations?\b/gi,
      message:
        "`integration` should be translated to `통합`.",
      suggestion: "통합",
    },
    {
      regex: /\bcomponents?\b/gi,
      message:
        "`component` should be translated to `컴포넌트`.",
      suggestion: "컴포넌트",
    },
  ],
};
