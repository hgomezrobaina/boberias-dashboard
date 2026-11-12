import { useEffect, useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export interface LinealDataProps {
  label: string;
  data: { unit: string; value: number }[];
  color: string;
}

interface Index {
  key: string;
  color: string;
}

interface Props {
  height: number;
  data: LinealDataProps[];
  y?: {
    formatter: (v: number) => string;
  };
  legend?: boolean;
}

export default function LinealChart({
  height,
  data: idata,
  y,
  legend = true,
}: Props) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [indexes, setIndexes] = useState<Index[]>([]);

  useEffect(() => {
    const result = [] as Record<string, unknown>[];
    const saveIndexes = [] as Index[];

    for (const d of idata) {
      for (const v of d.data) {
        const found = result.find((s) => s.unit === v.unit);

        if (found) {
          found[d.label] = v.value;
        } else {
          result.push({ unit: v.unit, [d.label]: v.value });
        }
      }

      const foundIndex = saveIndexes.some((s) => s.key === d.label);

      if (!foundIndex) {
        saveIndexes.push({
          key: d.label,
          color: d.color,
        });
      }
    }

    setData(result);
    setIndexes(saveIndexes);
  }, [idata]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="unit" className="text-sm" />
        <YAxis width="auto" className="text-sm" tickFormatter={y?.formatter} />
        <Tooltip formatter={y?.formatter} />
        <CartesianGrid />
        {legend && <Legend />}

        {indexes.map((i, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={i.key}
            stroke={i.color}
            strokeWidth={1.5}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
