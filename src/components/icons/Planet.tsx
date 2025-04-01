import * as React from "react";
import type { SVGProps } from "react";
const SvgPlanet = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <circle
      cx={12}
      cy={12}
      r={8.727}
      fill="#fff"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.296}
    />
    <ellipse
      cx={1.875}
      cy={16.867}
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      rx={12.806}
      ry={3.5}
      transform="rotate(-38.655)"
    />
  </svg>
);
export default SvgPlanet;
