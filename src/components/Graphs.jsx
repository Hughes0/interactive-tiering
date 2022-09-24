import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { getColor, count } from '../utils';



const CustomTooltip = ({ payload }) => {
    if (payload[0]) {
        return (
            <div>
                City {payload[0].payload.name}
                {payload.map((alliance) => {
                    return <div key={alliance.name}>{alliance.name}: {alliance.value}</div>;
                })}
            </div>
        );
    } else {
        return null;
    }
}

const TieringChart = ({ cities }) => {
    const data = [];
    const max = cities.reduce((a, b) => Math.max(a, b));
    for (let i = 1; i <= max; i++) {
        data.push({
            name: i.toString(),
            value: count(cities, i)
        });
    }
    return (
        <div style={{width: "100%", height:300}}>
            <ResponsiveContainer>
                <BarChart
                    width={1000}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend />
                    {/* @ts-ignore */}
                    <Tooltip content={CustomTooltip} />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
};

const StackedTieringChart = ({ coalitions, data }) => {
    return (
        <div style={{width: "100%", height:300}}>
            <ResponsiveContainer>
                <BarChart
                    width={1800}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend />
                    <Tooltip content={CustomTooltip} />
                    {coalitions.map((coalitionName, index) => {
                        return <Bar
                            dataKey={coalitionName}
                            stackId="a"
                            key={coalitionName}
                            fill={getColor(index)}
                        />;
                    })}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
};


const ComparisonTieringChart = ({
    coalitions,
    data
}) => {
    return (
        <div style={{width: "100%", height:300}}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name"/>
                    <YAxis />
                    <Legend />
                    {/* @ts-ignore */}
                    <Tooltip content={CustomTooltip} />
                    {coalitions.map((coalitionName, index) => {
                        return <Bar
                            dataKey={coalitionName}
                            key={coalitionName}
                            fill={getColor(index)}
                        />;
                    })}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
};



export { TieringChart, StackedTieringChart, ComparisonTieringChart };