"use client";

import { useEffect } from "react";

export default function Youglish({dataQuery}: {dataQuery: string}) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://youglish.com/public/emb/widget.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      <main className="container mx-auto px-4 py-8">
        <div className="mt-8">
          <a
            id="yg-widget-0"
            className="youglish-widget"
            data-query={dataQuery}
            data-lang="english"
            data-components="8415"
            data-bkg-color="theme_light"
            rel="nofollow"
            href="https://youglish.com"
          >
            Visit YouGlish.com
          </a>
        </div>
      </main>
    </div>
  );
}
