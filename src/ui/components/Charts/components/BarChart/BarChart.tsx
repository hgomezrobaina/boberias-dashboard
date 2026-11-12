import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  CartesianGrid,
} from "recharts";

interface Props<T> {
  data: T[];
  name: (v: T) => string;
  bars: { value: (v: T) => number; fill: string; name: string }[];
  y?: {
    formatter: (v: number) => string;
  };
  loading?: boolean;
  height?: number;
  legend?: boolean;
}

export default function BarChart<T>({
  height = 500,
  data,
  name,
  bars,
  y,
  legend = true,
}: Props<T>) {
  return (
    <>
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart width={500} height={height} data={data}>
          <XAxis dataKey={name} className="text-sm" />
          <YAxis
            width="auto"
            className="text-sm"
            tickFormatter={y?.formatter}
          />
          <Tooltip formatter={y?.formatter} />
          <CartesianGrid />
          {legend && <Legend />}

          {bars.map((b, index) => (
            <Bar
              radius={[6, 6, 0, 0]}
              dataKey={b.value}
              key={index}
              fill={b.fill}
              name={b.name}
            />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </>
  );
}
