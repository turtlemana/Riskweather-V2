import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { useRouter } from 'next/router';

const CandleChart = ({ data,chartSelect }) => {
    const router = useRouter();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const legendRef = useRef(null);
  const candleSeries = useRef(null);
  const lineSeries = useRef(null);

  


  useEffect(() => {
    if (!chartRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
        if (chartInstance.current && chartRef.current) {
          chartInstance.current.resize(
            chartRef.current.clientWidth,
            chartRef.current.clientHeight
          );
        }
      });

      resizeObserver.observe(chartRef.current);

      if (!chartInstance.current) {
        chartInstance.current = createChart(chartRef.current, {
          width: chartRef.current.clientWidth,
          height: 350
        });
        const markers = [];
        const highlightData = [];
        let wasRWILessThanEWI = true;
        
        for (let i = 0; i < data.length; i++) {
            const currentRWI = data[i].rwi;
            const currentEWI = data[i].ewi;
        
            if (currentRWI == null || currentEWI == null) continue;
        
            if (wasRWILessThanEWI && currentRWI > currentEWI) {
                markers.push({
                    time: data[i].time,
                    position: 'aboveBar',
                    color: '#e91e63',
                    shape: 'arrowDown',
                    text: 'Warning',
                });
        
                // 여기서 value를 화면 전체 높이로 설정합니다. 
                // 예를 들면, 가장 높은 close 값의 2배 (화면 상단까지)로 설정할 수 있습니다.
                highlightData.push({
                    time: data[i].time,
                    value: Math.max(...data.map(item => item.close)) * 2
                });
        
                wasRWILessThanEWI = false;
            } else if (currentRWI <= currentEWI) {
                wasRWILessThanEWI = true;
            }
        }

if(chartSelect === "Candle"){
    if (lineSeries.current) {
        chartInstance.current.removeSeries(lineSeries.current);
        lineSeries.current = null;
    }
      // Candlestick series
      candleSeries.current = chartInstance.current.addCandlestickSeries({
        priceScaleId: 'right',
      upColor: '#34A853',  
      downColor: '#EA4335',
      borderUpColor: '#34A853',
      borderDownColor: '#EA4335'
      });

      candleSeries.current.setData(data.map(item => ({
        time: item.time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      })));

      candleSeries.current.priceScale().applyOptions({
        scaleMargins: {
          // positioning the price scale for the area series
          top: 0,
          bottom: 0.2,
        },
      })

      candleSeries.current.priceScale().applyOptions({
        visible:true
      })

      candleSeries.current.setMarkers(markers);

    }
      const highlightSeries = chartInstance.current.addHistogramSeries({
        color: 'rgba(33, 150, 243, 0.4)',  // Semi-transparent blue for highlighting
        priceScaleId: 'highlight',  // Using the same priceScale as the candlestick for alignment
        overlay:true

    });

    if (chartSelect === "Line") {
        // 만약 candleSeries가 이미 있으면 삭제합니다.
        if (candleSeries.current) {
            chartInstance.current.removeSeries(candleSeries.current);
            candleSeries.current = null;
        }

        // lineSeries 생성 또는 업데이트
        if (!lineSeries.current) {
            lineSeries.current = chartInstance.current.addLineSeries({
                // ... 원하는 lineSeries 설정 ...
                color: 'green',

            });
        }

        lineSeries.current.setData(data.map(item => ({
            time: item.time,
            value: item.close,
        })));

        lineSeries.current.setMarkers(markers);

    }
    
    highlightSeries.setData(highlightData);
      // EWI series
      const ewiLineSeries = chartInstance.current.addLineSeries({
        priceScaleId: 'left',
        overlay: true,
        color: '#FF9900',
        lineWidth:1.5

      });

      ewiLineSeries.setData(data.filter(item => typeof item.ewi === 'number').map(item => ({
        time: item.time,
        value: item.ewi,
        
      })));

      // RWI series
      const rwiLineSeries = chartInstance.current.addLineSeries({
        priceScaleId: 'left',
        overlay: true,
        color: '#844DF4',  // Changing to Orange for RWI
        lineWidth: 1.5
      });
  

      rwiLineSeries.setData(data.filter(item => typeof item.rwi === 'number').map(item => ({
        time: item.time,
        value: item.rwi,
      })));

      // Adjust the layout of the price scales
      chartInstance.current.applyOptions({
        handleScale: {
            axisPressedMouseMove: {
                time: true, // x축 panning 활성화
                price: false // y축 panning 비활성화
            },
            mouseWheel: true
        },
        crosshair:{
mode:0
        },
        timeScale: {
          borderColor: '#ddd',
          rightOffset: 5,  // 오른쪽 여백을 5 데이터 포인트로 제한
          fixLeftEdge: true,  // 왼쪽 끝에서 추가로 줌 아웃되지 않도록 제한
          fixRightEdge: true  // 오른쪽 끝에서 추가로 줌 아웃되지 않도록 제한
        },
        layout: {
          backgroundColor: '#fff',
          textColor: '#333',
        },
        rightPriceScale: {
          visible: true,
        },
        leftPriceScale: {
          visible: false,
        },
      
        grid: {
          horzLines: {
            color: '#f7f7f7',
          },
          vertLines: {
            color: '#f7f7f7',
          },
        },
      });
     

     
      rwiLineSeries.priceScale().applyOptions({
        scaleMargins: {
          // positioning the price scale for the area series
          top: 0,
          bottom: 0.1,
        },
      })
      ewiLineSeries.priceScale().applyOptions({
        scaleMargins: {
          // positioning the price scale for the area series
          top: 0,
          bottom: 0.1,
        },
      })

      const volumeSeries = chartInstance.current.addHistogramSeries({
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // set as an overlay by setting a blank priceScaleId
        // set the positioning of the volume series
        scaleMargins: {
          top: 0, // highest point of the series will be 70% away from the top
          bottom: 0,
        },
        
      });
     
      highlightSeries.priceScale().applyOptions({
        autoScale: true,
        alignLabels: true,
        borderVisible: false,
        entireTextOnly: true,
        scaleMargins: {
          top: 0,
          bottom: 0
        }
      });
      
    
    volumeSeries.priceScale().applyOptions({
      drawTicks: false,
      scaleMargins: {
        top: 0.85, // 70% away from the top
        bottom: 0,
      },
      leftPriceScale: {
        visible: false
      }
  });
      const volumeData = data.filter(item => typeof item.volume === 'number').map(item => {
    let color = '#c0392b';  // Default to red (or your desired 'down' color)
    if (item.close > item.open) {
        color = '#26a69a';  // Change to green (or your desired 'up' color)
    }
    return {
        time: item.time,
        value: item.volume,
        color: color
    };
});

volumeSeries.setData(volumeData);
chartRef.current.style.position = 'relative';

const legendElement = document.createElement('div');
legendElement.style.position = 'absolute';
legendElement.style.top = '3px';  // 위쪽으로 위치 조정
legendElement.style.left = '15px';
legendElement.style.zIndex = '1';
legendElement.style.color = 'black';
legendElement.style.fontSize='12px';
legendElement.style.fontWeight="bold"
legendElement.style.marginBottom = '100px';  // 차트와 레전드 사이의 간격을 만듭니다.
legendRef.current = legendElement;
chartRef.current.appendChild(legendRef.current);

const formatValue = (value) => {
  if (value == null || typeof value === 'undefined') {
    return '-';
  }
  return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const updateLegend = (param = {}) => {
    if (!legendRef.current) return;
  
    let seriesData;
  
    if (param.seriesPrices) {
      for (const [series, price] of param.seriesPrices) {
        if (chartSelect === "Candle" && series === candleSeries.current) {
          seriesData = {
            open: price.open,
            high: price.high,
            low: price.low,
            close: price.close,
          };
        } else if (chartSelect === "Line" && series === lineSeries.current) {
          seriesData = {
            close: price,  // Assuming line chart only has a single 'close' value
          };
        }
      }
    }
  
    if (!seriesData && data) {
      const currentTime = param.time;
      const currentDataItem = data.find(item => item.time === currentTime);
      if (currentDataItem) {
        seriesData = {
          open: currentDataItem.open,
          high: currentDataItem.high,
          low: currentDataItem.low,
          close: currentDataItem.close,
        };
      }
    }
    const dateStr = data ? data.at(-1).time : ""

    const hasMarker = markers.some(marker => marker.time === dateStr);

    if (seriesData) {
      if (chartSelect === "Line") {
        const close = formatValue(seriesData.close);
        const changeColor = seriesData.close >= 0 ? "green" : "red";
        const warningMessage = hasMarker ? '<span style="margin-right: 5px;">⚠️</span>주의! 하락 위험! <br/> <span>RWI가 EWI를 초과했습니다</span>' : '';

        const lineInfo = `
            <div style="display: inline-block; margin-left: 10px;">
                ${router.locale==="ko" ? "가격" : "Value"}: <span style="color: ${changeColor}">${close}</span>
            
                ${hasMarker ? `<div style="  z-index: 1001;
                background-color: red; 
                border-radius: 5px;
                padding: 5px 10px;
                color: white;
                font-size: 0.8rem;
                pointer-events: none;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(0, 0, 0, 0.1); 
                white-space: nowrap;">${warningMessage}</div>` :''}
                </div>
        `;
        legendRef.current.innerHTML = lineInfo;
      } else if (chartSelect === "Candle") {
      const open = formatValue(seriesData.open);
      const high = formatValue(seriesData.high);
      const low = formatValue(seriesData.low);
      const close = formatValue(seriesData.close);
      const changeValue = seriesData.open ? ((seriesData.close - seriesData.open) / seriesData.open) * 100 : null;
      const changePercent = changeValue ? changeValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';
      const changeColor = changeValue > 0 ? "green" : "red";
  
  const rwiMarker = '<div style="display: inline-block; width: 10px; height: 10px; background-color: #844DF4; margin-right: 5px;"></div> RWI';
  const ewiMarker = '<div style="display: inline-block; width: 10px; height: 10px; background-color: #FF9900; margin-right: 5px;  margin-left: 10px;"></div> EWI';
  

  const dateStr = data ? data.at(-1).time : ""

  const hasMarker = markers.some(marker => marker.time === dateStr);

  const warningMessage = hasMarker ? '<span style="margin-right: 5px;">⚠️</span>주의! 하락 위험! <br/> <span>RWI가 EWI를 초과했습니다</span>' : '';

  const ohlcInfo = `
                <div style="display: inline-block; margin-left: 10px;">
                ${router.locale==="ko" ? "시가" : "Open"}: <span style="color: ${changeColor}">${open}</span> |
                ${router.locale==="ko" ? "고가" : "High"}: <span style="color: ${changeColor}">${high}</span> |
                ${router.locale==="ko" ? "저가" : "Low"}: <span style="color: ${changeColor}">${low}</span> |
                ${router.locale==="ko" ? "종가" : "Close"}: <span style="color: ${changeColor}">${close}</span> 
              <br/>
                ${router.locale==="ko" ? "가격변화" : "Change"}: <span style="color: ${changeColor}">${changePercent}%</span>
                ${hasMarker ? `<div style="  z-index: 1001;
                background-color: red; 
                border-radius: 5px;
                padding: 5px 10px;
                color: white;
                font-size: 0.8rem;
                pointer-events: none;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(0, 0, 0, 0.1); 
                white-space: nowrap;">${warningMessage}</div>` :''}
                </div>
            `;
  legendRef.current.innerHTML =ohlcInfo}} ;
//   +ohlc
}
updateLegend({time:  data[data.length - 1].time, point: {}});
legendElement.style.top = '-50px';
legendElement.style.left = '10px';
const toolTip = document.createElement('div');
toolTip.style = `
    font-weight: medium;
    position: absolute;
    z-index: 1000;
    display: none;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 5px;
    padding: 8px 12px;
    color: #333;
    font-size: 0.8rem;
    pointer-events: none;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    top: 20%;
    border: 1px solid rgba(0, 0, 0, 0.1);
`;

chartRef.current.appendChild(toolTip);

const toolTipRWI_EWI = document.createElement('div');
toolTipRWI_EWI.style = `
    position: absolute;
    z-index: 1001;
    display: none;
    background-color: #f44336;
    border-radius: 5px;
    padding: 5px 10px;
    color: #fff;
    font-size: 0.8rem;
    font-weight: bold;
    pointer-events: none;
    font-family: Arial, sans-serif;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.1);
`;

toolTipRWI_EWI.innerHTML = '<span style="margin-right: 5px;">⚠️</span>주의! 하락 위험! <br/> <span>RWI가 EWI를 초과했습니다</span>';
chartRef.current.appendChild(toolTipRWI_EWI);

const markerTooltip = document.createElement('div');
markerTooltip.style = `
  position: absolute;
  z-index: 1001;
  display: none;
  background-color: rgba(255, 255, 255, 0.9); 
  border-radius: 5px;
  padding: 5px 10px;
  color: #333;
  font-size: 0.8rem;
  pointer-events: none;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.1); 
  white-space: nowrap;
`;
markerTooltip.innerText = "RWI > EWI";
chartRef.current.appendChild(markerTooltip);
const formatDate = (dateObj) => {
    const { year, month, day } = dateObj;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};
const handleTouchMove = (event) => {
    if (!chartInstance.current || !candleSeries.current) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const touch = event.touches[0];
    if (!touch) return;
    const toolTipWidth = toolTip.offsetWidth;
    const toolTipHeight = toolTip.offsetHeight;

    let newLeft = touch.clientX - bounds.left; // 차트 내에서의 X 좌표
    let newTop = touch.clientY - bounds.top;   // 차트 내에서의 Y 좌표

    // 툴팁이 차트의 오른쪽 경계를 벗어나는 경우
    if (newLeft + toolTipWidth > bounds.width) {
        newLeft = bounds.width - toolTipWidth;
    }
    
    // 툴팁이 차트의 왼쪽 경계를 벗어나는 경우
    if (newLeft < 0) {
        newLeft = 0;
    }
    
    // 툴팁이 차트의 하단 경계를 벗어나는 경우
    if (newTop + toolTipHeight > bounds.height) {
        newTop = bounds.height - toolTipHeight;
    }
    
    // 툴팁이 차트의 상단 경계를 벗어나는 경우
    if (newTop < 0) {
        newTop = 0;
    }
    
    toolTip.style.left = `${newLeft + bounds.left}px`;
    toolTip.style.top = `${newTop + bounds.top}px`;
    
    const localX = touch.clientX - bounds.left;
    const timeForCoordinate = chartInstance.current.timeScale().coordinateToTime(localX);

    if (timeForCoordinate) {
        const utcDate = new Date(Date.UTC(timeForCoordinate.year, timeForCoordinate.month - 1, timeForCoordinate.day));
        const dateStr = `${utcDate.getUTCFullYear()}-${String(utcDate.getUTCMonth() + 1).padStart(2, '0')}-${String(utcDate.getUTCDate()).padStart(2, '0')}`;

        const currentIndex = data.findIndex(item => item.time === dateStr);
        const targetData = currentIndex !== -1 ? data[currentIndex] : null;

        if (targetData) {
            const formatValue = (value, noDecimal = false) => {
                if (value == null || typeof value === 'undefined') {
                    return '-';
                }
                const options = { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: noDecimal ? 0 : 2
                };
                return value.toLocaleString(undefined, options);
            };

            const formatSmallNumber = (value, noDecimal = false) => {
                if (value == null || typeof value === 'undefined') {
                    return '-';
                }
                const options = { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: noDecimal ? 0 : 4
                };
                return value.toLocaleString(undefined, options);
            };

            const formatChange = (open, close) => {
                if (open == null || close == null || typeof open === 'undefined' || typeof close === 'undefined') return '-';
                return (((close - open) / open) * 100).toLocaleString('en-us', { minimumFractionDigits: 0, maximumFractionDigits: 2});
            };

            const open = formatValue(targetData.open);
            const high = formatValue(targetData.high);
            const low = formatValue(targetData.low);
            const close = formatValue(targetData.close);
            const changeValue = targetData.open ? ((targetData.close - targetData.open) / targetData.open) * 100 : null;
            const change = formatChange(targetData.open, targetData.close);
            const changeColor = changeValue >= 0 ? "green" : "red";
            const volume = formatValue(targetData.volume, true);
            const ewi = formatSmallNumber(targetData.ewi);
            const rwi = formatSmallNumber(targetData.rwi);

            toolTip.innerHTML = `
                <ul style="list-style-type: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 4px;"><strong>${router.locale==="ko" ? "시가" : "Open"}:</strong> <span>${open}${"＄"}</span></li>
                    <li style="margin-bottom: 4px;"><strong>${router.locale==="ko" ? "고가" : "High"}:</strong> <span>${high}${"＄"}</span></li>
                    <li style="margin-bottom: 4px;"><strong>Low:</strong> <span>${low}${"＄"}</span></li>
                    <li style="margin-bottom: 4px;"><strong>Close:</strong> <span>${close}${"＄"}</span></li>
                    <li style="margin-bottom: 4px;"><strong>Change:</strong> <span style="color: ${changeColor}">${change}%</span></li>
                    <br/>
                    <li style="margin-bottom: 4px;"><strong>Volume:</strong> ${volume}</li>
                    <br/>
                    <li style="margin-bottom: 4px;"><strong>EWI:</strong> ${ewi}</li>
                    <li><strong>RWI:</strong> ${rwi}</li>
                </ul>
            `;

            let adjustedLeft = touch.clientX - bounds.left - (toolTip.offsetWidth / 2);
            let adjustedTop = touch.clientY - bounds.top - (toolTip.offsetHeight / 2);

            if (adjustedLeft + toolTip.offsetWidth > bounds.right) {
                adjustedLeft = bounds.right - toolTip.offsetWidth;
            }

            if (adjustedLeft < bounds.left) {
                adjustedLeft = bounds.left;
            }

            if (adjustedTop + toolTip.offsetHeight > bounds.bottom) {
                adjustedTop = bounds.bottom - toolTip.offsetHeight;
            }

            if (adjustedTop < bounds.top) {
                adjustedTop = bounds.top;
            }

            toolTip.style.left = `${adjustedLeft}px`;
            toolTip.style.top = `${adjustedTop}px`;
            toolTip.style.display = 'block';

            const hasMarker = markers.some(marker => marker.time === dateStr);
            if (hasMarker) {
                toolTipRWI_EWI.style.left = `${toolTip.offsetLeft + toolTip.offsetWidth}px`;
                toolTipRWI_EWI.style.top = `${adjustedTop}px`;  // 마커 툴팁의 상단 위치를 동일하게 설정
                if (toolTipRWI_EWI.offsetTop < bounds.top) {
                    toolTipRWI_EWI.style.top = `${bounds.top}px`;
                }
                toolTipRWI_EWI.style.display = 'block';
            } else {
                toolTipRWI_EWI.style.display = 'none';
            }
        } else {
            toolTip.style.display = 'none';
            toolTipRWI_EWI.style.display = 'none';
        }
    }
};

const handleTouchStart = (event) => {
    if (!chartInstance.current || (!candleSeries.current && !lineSeries.current)) return;
    let targetData = null;

    const bounds = event.currentTarget.getBoundingClientRect();
    const touch = event.touches[0];
    if (!touch) return;
     const halfTooltipWidth = toolTip.offsetWidth / 2;
    const halfTooltipHeight = toolTip.offsetHeight / 2;

    let newLeft = touch.clientX - halfTooltipWidth;
    let newTop = touch.clientY - halfTooltipHeight;

    // 툴팁이 차트의 오른쪽 경계를 벗어나는 경우
    if (newLeft + toolTip.offsetWidth > bounds.right) {
        newLeft = bounds.right - toolTip.offsetWidth;
    }
    
    // 툴팁이 차트의 왼쪽 경계를 벗어나는 경우
    if (newLeft < bounds.left) {
        newLeft = bounds.left;
    }
    
    // 툴팁이 차트의 하단 경계를 벗어나는 경우
    if (newTop + toolTip.offsetHeight > bounds.bottom) {
        newTop = bounds.bottom - toolTip.offsetHeight;
    }
    
    // 툴팁이 차트의 상단 경계를 벗어나는 경우
    if (newTop < bounds.top) {
        newTop = bounds.top;
    }
    
    toolTip.style.left = `${newLeft}px`;
    toolTip.style.top = `${newTop}px`;
    
    const localX = touch.clientX - bounds.left;
    const timeForCoordinate = chartInstance.current.timeScale().coordinateToTime(localX);

    if (timeForCoordinate) {
        const utcDate = new Date(Date.UTC(timeForCoordinate.year, timeForCoordinate.month - 1, timeForCoordinate.day));
        const dateStr = `${utcDate.getUTCFullYear()}-${String(utcDate.getUTCMonth() + 1).padStart(2, '0')}-${String(utcDate.getUTCDate()).padStart(2, '0')}`;

        if (chartSelect === "Candle") {
            const currentIndex = data.findIndex(item => item.time === dateStr);
            targetData = currentIndex !== -1 ? data[currentIndex] : null;
        } else if (chartSelect === "Line") {
            // lineSeries 데이터 가져오기
            const lineDataIndex = data.findIndex(item => item.time === dateStr);
            targetData = lineDataIndex !== -1 ? data[lineDataIndex] : null;
        }
    //     if (targetData) {
    //         const formatValue = (value, noDecimal = false) => {
    //             if (value == null || typeof value === 'undefined') {
    //                 return '-';
    //             }
    //             const options = { 
    //                 minimumFractionDigits: 0, 
    //                 maximumFractionDigits: noDecimal ? 0 : 2
    //             };
    //             return value.toLocaleString(undefined, options);
    //         };

    //         const formatSmallNumber = (value, noDecimal = false) => {
    //             if (value == null || typeof value === 'undefined') {
    //                 return '-';
    //             }
    //             const options = { 
    //                 minimumFractionDigits: 0, 
    //                 maximumFractionDigits: noDecimal ? 0 : 4
    //             };
    //             return value.toLocaleString(undefined, options);
    //         };

    //         const formatChange = (open, close) => {
    //             if (open == null || close == null || typeof open === 'undefined' || typeof close === 'undefined') return '-';
    //             return (((close - open) / open) * 100).toLocaleString('en-us', { minimumFractionDigits: 0, maximumFractionDigits: 2});
    //         };

    //         const open = formatValue(targetData.open);
    //         const high = formatValue(targetData.high);
    //         const low = formatValue(targetData.low);
    //         const close = formatValue(targetData.close);
    //         const changeValue = targetData.open ? ((targetData.close - targetData.open) / targetData.open) * 100 : null;
    //         const change = formatChange(targetData.open, targetData.close);
    //         const changeColor = changeValue >= 0 ? "green" : "red";
    //         const volume = formatValue(targetData.volume, true);
    //         const ewi = formatSmallNumber(targetData.ewi);
    //         const rwi = formatSmallNumber(targetData.rwi);

    //         toolTip.innerHTML = `
    //         <ul style="list-style-type: none; padding: 0; margin: 0; font-size: 0.8rem;">
    //         <li style="margin-bottom: 4px;"><strong>${router.locale==="ko" ? "시가" : "Open"}:</strong> <span>${open}${"＄"}</span></li>
    //                 <li style="margin-bottom: 4px;"><strong>${router.locale==="ko" ? "고가" : "High"}:</strong> <span>${high}${"＄"}</span></li>
    //                 <li style="margin-bottom: 4px;"><strong>${router.locale==="ko" ? "저가" : "Low"}:</strong> <span>${low}${"＄"}</span></li>
    //                 <li style="margin-bottom: 4px;"><strong>${router.locale==="ko" ? "종가" : "Close"}:</strong> <span>${close}${"＄"}</span></li>
    //                 <li style="margin-bottom: 4px;"><strong>${router.locale==="ko" ? "가격변화" : "Change"}:</strong> <span style="color: ${changeColor}">${change}%</span></li>
    //                 <br/>
    //                 <li style="margin-bottom: 4px;"><strong>${router.locale==="ko" ? "거래대금" : "Volume"}:</strong> ${volume}</li>
    //                 <br/>
    //                 <li style="margin-bottom: 4px;"><strong>EWI:</strong> ${ewi}</li>
    //                 <li><strong>RWI:</strong> ${rwi}</li>
    //             </ul>
    //         `;

    //         let adjustedLeft = touch.clientX - bounds.left - (toolTip.offsetWidth / 2);
    // let adjustedTop = touch.clientY - bounds.top - (toolTip.offsetHeight / 2);

    // // 차트의 오른쪽 경계를 벗어나는 경우
    // if (adjustedLeft + toolTip.offsetWidth > bounds.width) {
    //     adjustedLeft = bounds.width - toolTip.offsetWidth;
    // }

    // // 차트의 왼쪽 경계를 벗어나는 경우
    // if (adjustedLeft < 0) {
    //     adjustedLeft = 0;
    // }

    // // 차트의 하단 경계를 벗어나는 경우
    // if (adjustedTop + toolTip.offsetHeight > bounds.height) {
    //     adjustedTop = bounds.height - toolTip.offsetHeight;
    // }

    // // 차트의 상단 경계를 벗어나는 경우
    // if (adjustedTop < 0) {
    //     adjustedTop = 0;
    // }

    // toolTip.style.left = `${adjustedLeft + bounds.left}px`;
    // toolTip.style.top = `${adjustedTop + bounds.top}px`;
        
    //         toolTip.style.display = 'block';

    //         const hasMarker = markers.some(marker => marker.time === dateStr);

    //         if (hasMarker) {
    //             toolTipRWI_EWI.style.left = `${toolTip.offsetLeft + toolTip.offsetWidth}px`;
    //             toolTipRWI_EWI.style.top = `${adjustedTop}px`;  // 마커 툴팁의 상단 위치를 동일하게 설정
    //             if (toolTipRWI_EWI.offsetTop < bounds.top) {
    //                 toolTipRWI_EWI.style.top = `${bounds.top}px`;
    //             }
    //             toolTipRWI_EWI.style.display = 'block';
    //         } else {
    //             toolTipRWI_EWI.style.display = 'none';
    //         }
    //     } else {
    //         toolTip.style.display = 'none';
    //         toolTipRWI_EWI.style.display = 'none';
    //     }

    if (targetData) {
        const hasMarker = markers.some(marker => marker.time === dateStr);
        const warningMessage = hasMarker ? '<span style="margin-right: 5px;">⚠️</span>주의! 하락 위험! <br/> <span>RWI가 EWI를 초과했습니다</span>' : '';
        const changeColor = targetData.value >= 0 ? "green" : "red"; // Assuming targetData has a 'value' field for lineSeries

        if (chartSelect === "Line") {
            const lineDataItem = data.find(item => item.time === dateStr);
            if (lineDataItem) {
                const value = lineDataItem.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const changeColor = value >= 0 ? "green" : "red";
        
                const lineInfo = `
                    <div style="display: inline-block; margin-left: 10px;">
                        ${router.locale==="ko" ? "가격" : "Value"}: <span style="color: ${changeColor}">${value}</span>
                        ${hasMarker ? `<div style="  z-index: 1001;
                            background-color: red; 
                            border-radius: 5px;
                            padding: 5px 10px;
                            color: white;
                            font-size: 0.8rem;
                            pointer-events: none;
                            font-family: Arial, sans-serif;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                            border: 1px solid rgba(0, 0, 0, 0.1); 
                            white-space: nowrap;">${warningMessage}</div>` : ''}
                    </div>
                `;
                legendRef.current.innerHTML = lineInfo;
            }
        }  else if (chartSelect === "Candle") {
            const open = targetData.open.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const high = targetData.high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const low = targetData.low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const close = targetData.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const changeValue = targetData.open ? ((targetData.close - targetData.open) / targetData.open) * 100 : null;
            const changePercent = changeValue ? changeValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';
            
            const ohlcInfo = `
                <div style="display: inline-block; margin-left: 10px;">
                    ${router.locale==="ko" ? "시가" : "Open"}: <span style="color: ${changeColor}">${open}</span> |
                    ${router.locale==="ko" ? "고가" : "High"}: <span style="color: ${changeColor}">${high}</span> |
                    ${router.locale==="ko" ? "저가" : "Low"}: <span style="color: ${changeColor}">${low}</span> |
                    ${router.locale==="ko" ? "종가" : "Close"}: <span style="color: ${changeColor}">${close}</span> 
                   <br/>
                    ${router.locale==="ko" ? "가격변화" : "Change"}: <span style="color: ${changeColor}">${changePercent}%</span>
                    ${hasMarker ? `<div style="  z-index: 1001;
                        background-color: red; 
                        border-radius: 5px;
                        padding: 5px 10px;
                        color: white;
                        font-size: 0.8rem;
                        pointer-events: none;
                        font-family: Arial, sans-serif;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                        border: 1px solid rgba(0, 0, 0, 0.1); 
                        white-space: nowrap;">${warningMessage}</div>` : ''}
                </div>
            `;
            legendRef.current.innerHTML = ohlcInfo;
        }
    }}
};

// chartRef.current.addEventListener('touchmove', handleTouchMove);
chartRef.current.addEventListener('touchstart', handleTouchStart);

chartInstance.current.subscribeCrosshairMove((param) => {
  const dateStr = param.time;
  const currentData = data.find(item => item.time === dateStr);

  if (!currentData || !param.point) {
    toolTip.style.display = 'none';
    toolTipRWI_EWI.style.display = 'none';
    return;
}


  const hasMarker = markers.some(marker => marker.time === param.time);


  const formatValue = (value, noDecimal = false) => {
    if (value == null || typeof value === 'undefined') {
      return '-';
    }
    const options = { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: noDecimal ? 0 : 2
    };
    return value.toLocaleString(undefined, options);
  };
  const formatSmallNumber = (value, noDecimal = false) => {
    if (value == null || typeof value === 'undefined') {
      return '-';
    }
    const options = { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: noDecimal ? 0 : 4
    };
    return value.toLocaleString(undefined, options);
  };
  const formatChange = (open, close) => {
    if (open == null || close == null || typeof open === 'undefined' || typeof close === 'undefined') return '-';
    return (((close - open) / open) * 100).toLocaleString('en-us', { minimumFractionDigits: 0, maximumFractionDigits: 2});
  };

 

  const open = formatValue(currentData.open);
  const high = formatValue(currentData.high);
  const low = formatValue(currentData.low);
  const close = formatValue(currentData.close);
  const changeValue = currentData.open ? ((currentData.close - currentData.open) / currentData.open) * 100 : null;
    const change = formatChange(currentData.open, currentData.close);
    const changeColor = changeValue >= 0 ? "green" : "red";  const volume = formatValue(currentData.volume, true);  // volume에 소수점 없게
  const ewi = formatSmallNumber(currentData.ewi);
  const rwi = formatSmallNumber(currentData.rwi);
  updateLegend(param);

  toolTip.innerHTML = `
  <ul style="list-style-type: none; padding: 0; margin: 0;">
    <li style="margin-bottom: 4px;"><strong>Open:</strong> <span>${open}${"＄"}</span></li>
    <li style="margin-bottom: 4px;"><strong>High:</strong> <span>${high}${"＄"}</span></li>
    <li style="margin-bottom: 4px;"><strong>Low:</strong> <span>${low}${"＄"}</span></li>
    <li style="margin-bottom: 4px;"><strong>Close:</strong> <span>${close}${"＄"}</span></li>
    <li style="margin-bottom: 4px;"><strong>Change:</strong> <span style="color: ${changeColor}">${change}%</span></li>
   <br/>
    <li style="margin-bottom: 4px;"><strong>Volume:</strong> ${volume}</li>
    <br/>
    <li style="margin-bottom: 4px;"><strong>EWI:</strong> ${ewi}</li>
    <li><strong>RWI:</strong> ${rwi}</li>
  </ul>
`;


const midPoint = (currentData.high + currentData.low) / 2;
toolTip.style.left = `${param.point.x - (toolTip.offsetWidth / 2)}px`;
toolTip.style.top = `${param.point.y - (toolTip.offsetHeight / 2)}px`;
if (toolTip.offsetTop < 0) { // 화면 상단 경계를 초과하는 경우 조정
  toolTip.style.top = '0px';
}
toolTip.style.display = 'block';

// RWI > EWI 툴팁 위치 및 표시 여부 설정
if (hasMarker) {
  toolTipRWI_EWI.style.left = `${toolTip.offsetLeft + toolTip.offsetWidth}px`; 
  toolTipRWI_EWI.style.top = `${param.point.y - (toolTipRWI_EWI.offsetHeight / 2)}px`;
  if (toolTipRWI_EWI.offsetTop < 0) { // 화면 상단 경계를 초과하는 경우 조정
    toolTipRWI_EWI.style.top = '0px';
  }
  toolTipRWI_EWI.style.display = 'block';
} else {
  toolTipRWI_EWI.style.display = 'none';
}
return () => {
    // Cleanup
    chartRef.current.removeEventListener('touchmove', handleTouchMove);
    chartRef.current.removeEventListener('touchstart', handleTouchStart);
};

});

}
}, [data]);

  return <div 
  ref={chartRef} 
  style={{ 
    width: '100%', 
    height: '100%'  
  }}
/>;
};

export default CandleChart;
