import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressChartData } from '@/types/progress';

interface ProgressChartProps {
  data: ProgressChartData;
  title: string;
  unit?: string;
  color?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  title, 
  unit = '', 
  color = '#3b82f6' 
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            {`${data.datasets[0].label}: ${payload[0].value}${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.labels.map((label, index) => ({
              name: label,
              value: data.datasets[0].data[index]
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#666"
                fontSize={12}
                tick={{ fill: '#666' }}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tick={{ fill: '#666' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Progress Summary Chart Component
interface ProgressSummaryChartProps {
  data: {
    name: string;
    current: number;
    target: number;
    percentage: number;
  }[];
}

export const ProgressSummaryChart: React.FC<ProgressSummaryChartProps> = ({ data }) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">ملخص التقدم اليومي</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <span className="text-sm text-gray-600">
                  {item.current} / {item.target}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.percentage >= 80 ? 'bg-green-500' :
                    item.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium ${
                  item.percentage >= 80 ? 'text-green-600' :
                  item.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
