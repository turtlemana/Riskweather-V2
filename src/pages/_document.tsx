import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="ko-KR">
      <Head>
        <link rel="alternate" hrefLang="ko-KR" href="https://riskweather.io/" />
        <link
          rel="alternate"
          hrefLang="en-US"
          href="https://riskweather.io/en"
        />
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NJ75NLQ');
        `,
          }}
        />
      </Head>
      <body>
        {/* Google Tag Manager (noscript) */}

        {/* <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NJ75NLQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript> */}

        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NJ75NLQ"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
              `,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
