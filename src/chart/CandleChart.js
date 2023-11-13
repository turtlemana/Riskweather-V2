import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const CandleChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const legendRef = useRef(null);
  const candleSeries = useRef(null);  


  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = createChart(chartRef.current, { width: 1200, height: 800 });

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

      const highlightSeries = chartInstance.current.addHistogramSeries({
        color: 'rgba(33, 150, 243, 0.4)',  // Semi-transparent blue for highlighting
        priceScaleId: 'highlight',  // Using the same priceScale as the candlestick for alignment
        overlay:true

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
    
    highlightSeries.setData(highlightData);
      // EWI series
      const ewiLineSeries = chartInstance.current.addLineSeries({
        priceScaleId: 'left',
        overlay: true,
        color: '#FFDC3C',
        lineWidth:1

      });

      ewiLineSeries.setData(data.filter(item => typeof item.ewi === 'number').map(item => ({
        time: item.time,
        value: item.ewi,
        
      })));

      // RWI series
      const rwiLineSeries = chartInstance.current.addLineSeries({
        priceScaleId: 'left',
        overlay: true,
        color: '#B39DDB',  // Changing to Orange for RWI
        lineWidth: 1
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
     

      candleSeries.current.priceScale().applyOptions({
        scaleMargins: {
          // positioning the price scale for the area series
          top: 0,
          bottom: 0.2,
        },
      })
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
      candleSeries.current.priceScale().applyOptions({
        visible:true
      })
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
candleSeries.current.setMarkers(markers);

volumeSeries.setData(volumeData);


const legendElement = document.createElement('div');
legendElement.style.position = 'absolute';
legendElement.style.top = '3px';  // 위쪽으로 위치 조정
legendElement.style.left = '12px';
legendElement.style.zIndex = '1';
legendElement.style.color = 'black';
legendElement.style.fontWeight="bold"
legendElement.style.marginBottom = '50px';  // 차트와 레전드 사이의 간격을 만듭니다.
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
  
  // Check if mouse is over the chart area
  if (!param.time || !param.point) return;
  
  let seriesData;
  
  if (!param.seriesPrices) {
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

  const open = formatValue(seriesData.open);
  const high = formatValue(seriesData.high);
  const low = formatValue(seriesData.low);
  const close = formatValue(seriesData.close);
  const changeValue = seriesData.open ? ((seriesData.close - seriesData.open) / seriesData.open) * 100 : null;
  const changePercent = changeValue ? changeValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-';
  const changeColor = changeValue > 0 ? "green" : "red";  

  const ewiMarker = '<div style="display: inline-block; width: 10px; height: 10px; background-color: #FFDC3C; margin-right: 5px;"></div> EWI';
  const rwiMarker = '<div style="display: inline-block; width: 10px; height: 10px; background-color: #B39DDB; margin-right: 5px; margin-left: 10px;"></div> RWI';

  const ohlcInfo = `
    <div style="display: inline-block; margin-left: 10px;">
      Open: <span style="color: ${changeColor}">${open}</span> |
      High: <span style="color: ${changeColor}">${high}</span> |
      Low: <span style="color: ${changeColor}">${low}</span> |
      Close: <span style="color: ${changeColor}">${close}</span> |
      Change: <span style="color: ${changeColor}">${changePercent}%</span>
    </div>
  `;

  legendRef.current.innerHTML = ewiMarker + rwiMarker + ohlcInfo;
};
updateLegend({time: data[data.length - 1].time, point: {}});

const toolTip = document.createElement('div');
toolTip.style = `
font-weight:medium;
  position: absolute;
  z-index: 1000;
  display: none;
  background-color: rgba(255, 255, 255, 0.9);  // Semi-transparent white background
  border-radius: 5px;
  padding: 8px 12px;
  color: #333;
  font-size: 15px;
  pointer-events: none;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  top: 20%;
  border: 1px solid rgba(0, 0, 0, 0.1);  // A subtle border
`;
chartRef.current.appendChild(toolTip);
const toolTipRWI_EWI = document.createElement('div');
toolTipRWI_EWI.style = `
  position: absolute;
  z-index: 1001;
  display: none;
  background-color: #f44336;  // 빨간색 배경
  border-radius: 5px;
  padding: 5px 10px;
  color: #fff;  // 흰색 글씨
  font-size: 14px;  // 글씨 크기 증가
  font-weight: bold;  // 굵은 글꼴
  pointer-events: none;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.1);
`;
toolTipRWI_EWI.innerHTML = '<span style="margin-right: 5px;">⚠️</span>주의! 하락 위험! <br/> <span>RWI가 EWI를 초과했습니다</span>';  // 경고 아이콘과 새로운 메시지 추가
chartRef.current.appendChild(toolTipRWI_EWI);


const markerTooltip = document.createElement('div');
markerTooltip.style = `
  position: absolute;
  z-index: 1001;
  display: none;
  background-color: rgba(255, 255, 255, 0.9);  // Semi-transparent white background
  border-radius: 5px;
  padding: 5px 10px;
  color: #333;
  font-size: 12px;
  pointer-events: none;
  font-family: Arial, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.1);  // A subtle border
  white-space: nowrap;
`;
markerTooltip.innerText = "RWI > EWI";
chartRef.current.appendChild(markerTooltip);


chartInstance.current.subscribeCrosshairMove((param) => {
  if (param.point) {
} else {
}
  
  const dateStr = param.time;
  const currentData = data.find(item => item.time === dateStr);

  if (!currentData || !param.point) {
    toolTip.style.display = 'none';
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


  // 툴팁 내용 업데이트
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
});
}
}, [data]);

  return <div ref={chartRef} />;
};

export default CandleChart;
