import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

let tvScriptLoadingPromise;

export default function TradingViewWidget({ data }) {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());
    return () => onLoadScriptRef.current = null;

    function createWidget() {
      if (document.getElementById('technical-analysis-chart-demo') && 'TradingView' in window) {
        new window.TradingView.widget({
          container_id: "technical-analysis-chart-demo",
          width: "100%",
          height: "100%",
          autosize: true,
          symbol: "ETH-USD",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          datafeed: {
            onReady: (cb) => cb({ supported_resolutions: ["1D"] }),
            searchSymbols: () => {},
            resolveSymbol: (symbolName, onSymbolResolvedCallback) => {
              const symbolInfo = {
                name: 'ETH-USD',
                ticker: 'ETH-USD',
                supported_resolutions: ['1D'],
                pricescale: 1,
              };
              onSymbolResolvedCallback(symbolInfo);
            },
            getBars: (symbolInfo, resolution, from, to, onHistoryCallback) => {
              const filteredData = data.map(item => ({
                time: new Date(item.time).getTime() / 1000,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume,
                ewi:item.ewi, 
                rwi:item.rwi,
              }));
              onHistoryCallback(filteredData);
            },
            subscribeBars: () => {},
            unsubscribeBars: () => {}
          },
          locale: "en"
        });
      }
    }
  }, [data]);

  return (
    <div className='tradingview-widget-container'>
      <div id='technical-analysis-chart-demo' />
      <div className="tradingview-widget-copyright">
        <Link href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></Link>
      </div>
    </div>
  );
}
