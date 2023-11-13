import {
    AreaChart,
    LineChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
  } from "recharts";
  
 
  
  export default function CardChart({chartData}) {
    // const chartDat=useMemo(()=>{
    //   const chartColor=JSON.parse(JSON.stringify(chartData))
    //   if(chartData[0].y > chartData.at(-1).y){
    //     chartColor[0].color="#DC2828"
    // } else if(chartData[0].y <= chartData.at(-1).y){
    //   chartColor[0].color="#36D399"
    // }

    // return chartColor
    // },[chartData])

    const MAX_LENGTH = 79;

function formatData(chartData) {
  // 빈 배열을 만들고, chartData로 채운다.
  const formattedData = new Array(MAX_LENGTH).fill({}).map((item, index) => {
    return chartData[index] ? chartData[index] : { x: '', cvar: null };
  });
  return formattedData;
}


const formattedData = formatData(chartData);

    
    
    return (
      <div style={{ width: 128, height: 40 }}>
        <ResponsiveContainer >
          <AreaChart
            width={128}
            height={40}
            data={formattedData}
            margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 0
            }}
          >
            <defs>
              <linearGradient id="gradientColor" x1="1" y1="0" x2="1" y2="1">
              <stop offset="30%" stopColor="#0198FF" stopOpacity={0.2} />
        <stop offset="70%" stopColor="#A3BCFF" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <YAxis yAxisId="left" hide={true}tickCount="5" type="number" domain={['auto','auto']}/>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            {/* <XAxis  dataKey="x"  />
            <YAxis   yAxisId="left" width={2} />
            <YAxis yAxisId="right" width={2} orientation="right" className={`text-sm`} /> */}
            {/* <Tooltip /> */}
            {/* <Legend/> */}
            <Area
            dot={false}
              yAxisId="left"
              type="linear"
              dataKey="cvar"
              stroke={"#467AFF"}
            //   activeDot={{ r: 4 }}
            fill="url(#gradientColor)"
              connectNulls={true}
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  