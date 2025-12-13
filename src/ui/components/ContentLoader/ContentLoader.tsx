import clsx from "clsx";

import "./style.css";

interface Props {
  height: number;
  className?: string;
  width?: number;
  circle?: boolean;
}

export default function ContentLoader({
  height,
  className,
  width,
  circle,
}: Props) {
  return (
    <div
      className={clsx(circle ? "rounded-full" : "rounded-md", className)}
      style={{
        animation: "loader 2s infinite ease-in-out",
        height: `${height}px`,
        width: width ? `${width}px` : `100%`,
      }}
    ></div>
  );
}
