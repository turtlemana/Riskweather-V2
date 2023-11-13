import React from 'react';
import { BarChart, XAxis, YAxis, Bar, Cell, Rectangle } from 'recharts';

const getSegmentColor = (index) => {
    const gradient = [
        'black', 'dimgray', 'gray', 'darkgray', 'silver', 
        'lightgray', 'gainsboro', 'whitesmoke', 'ivory', 'white'
    ];
    return gradient[index];
};

const CustomBar = (props) => {
    const { fill, x, y, width, height, data } = props;

    let accumulatedWidth = x;
    const totalItems = data.length;
    return data.map((item, index) => {
        const cellWidth = width * item.percentage;
        const isLeftmost = index === 0;
        const isRightmost = index === totalItems - 1;
        const radius = isLeftmost ? [10, 0, 0, 10] : isRightmost ? [0, 15, 15, 0] : [0, 0, 0, 0];
        
        const result = (
            <Rectangle
                key={`cell-${index}`}
                x={accumulatedWidth}
                y={y}
                width={cellWidth}
                height={height}
                fill={getSegmentColor(index)}
                stroke="white"
                strokeWidth={1}
                radius={radius}
            />
        );
        accumulatedWidth += cellWidth;
        return result;
    });
};

const PortfolioBarChart = ({ data }) => {
    const total = data.totalPortfolioPriceKr;

    const items =data.items &&  data.items.map(item => ({
        name: item.name,
        value: item.totalMarketKrPrice,
        percentage: item.totalMarketKrPrice / total,
    })).sort((a, b) => b.value - a.value);

    return (
        <BarChart width={650} height={60} data={[{ name: data.portName, total: total }]} layout="vertical">
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            <Bar dataKey="total" shape={<CustomBar data={items} />} />
        </BarChart>
    );
};

export default PortfolioBarChart;
