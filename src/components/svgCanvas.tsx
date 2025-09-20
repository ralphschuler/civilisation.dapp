import React, { useId } from "react";

const SvgCanvas = (props: React.PropsWithChildren<{}>) => {
  const id = useId();
  const viewBox = [
    window.innerWidth / -2,
    100 - window.innerHeight,
    window.innerWidth,
    window.innerHeight,
  ];

  return (
    <svg
      role="img"
      aria-label="SVG Canvas"
      id={id}
      preserveAspectRatio="xMidYMid meet"
      viewBox={viewBox.join(" ")}
    >
      <title>SVG Canvas</title>
      {props.children}
    </svg>
  );
};

export default SvgCanvas;
