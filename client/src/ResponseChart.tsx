import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PollResult } from '../services/polling';

type Props = {
  data: {
    input: string;
    result: PollResult;
  }[];
};
// have to store data in local storage so that data transfers over between pages
export default function MainGraph({ data }: Props) {
  const chartData = data.map((item, i) => ({
    name: `#${i + 1}`,
    responseTime: item.result.responseTime,
  }));
  

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
        <XAxis dataKey="name" stroke="#666" />
        <YAxis width={60} stroke="#666" />
        <Tooltip
          cursor={{ stroke: '#999' }}
          contentStyle={{
            backgroundColor: '#fff',
            borderColor: '#999',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="responseTime"
          stroke="#8884d8"
          dot={{ fill: '#8884d8' }}
          activeDot={{ r: 8, stroke: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}