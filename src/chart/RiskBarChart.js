import React,{useMemo} from "react";
import { BarChart,ReferenceLine , Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip, LabelList, ResponsiveContainer } from 'recharts';

const CustomLabel = props => {
    const { x, y, value, width, index, data } = props;
    const isLast = index === 6;
    return (
      <text 
        x={x + width / 2} 
        y={y - 10} 
        fill={isLast ? "#EA4335" : "#888888"} 
        textAnchor="middle"
        fontWeight={isLast ? "bold" : "normal"}
      >
        {value && value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </text>
    );
  };

const BottomLabel = props => {
    const { x, y, width, index, height, viewBox } = props;
    const labels = ['D-30', 'D-25', 'D-20', 'D-15', 'D-10', 'D-5', '오늘'];
    return (
      <text
      x={x + width / 2} y={viewBox.y + viewBox.height + 20} fill="#333" textAnchor="middle"
      fontWeight={labels[index] === '오늘' ? 'bold' : 'normal'} // fontWeight 조절
      >
        {labels[index]}
      </text>
    );
};

const CVaRBarChart = ({data}) => {
    const average =
    useMemo(()=>{
    if (data && data.length>0) return data.reduce((sum, entry) => sum + entry.exp_cvar, 0) / data.length;
    },[data])


    return (
    <div className="rounded-lg text-xs bg-white p-4 h-[150px] w-800:w-5/6 w-full " >
      <ResponsiveContainer>
        <BarChart
          barCategoryGap="20%"
    barGap={30}
          data={data}
          margin={{top: 25, right:0 , left: 0, bottom: 25}}
          barSize={35} // 바의 높이 조절
        >
          {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
          <XAxis hide />
          <YAxis hide domain={[0, 'dataMax']}/>

          <Bar dataKey="exp_cvar" fill="#8884d8" barGap={20} radius={[5, 5, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#EA4335' : '#D1D5DB'} />
            ))}
            <LabelList dataKey="exp_cvar" position="top" content={<CustomLabel />} />
            <LabelList dataKey="exp_cvar" position="bottom" content={<BottomLabel />} />
          </Bar>
          <ReferenceLine
  z={1}

  className="z-30"
  y={average}
  stroke="gray"
  strokeDasharray="3 3"
  strokeOpacity={0.5}
/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CVaRBarChart;
