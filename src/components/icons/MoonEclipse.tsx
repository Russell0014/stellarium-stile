import * as React from "react";
import type { SVGProps } from "react";
const SvgMoonEclipse = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <circle
      cx={10}
      cy={12}
      r={6.993}
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="bevel"
      strokeWidth={2}
    />
    <circle cx={14} cy={12} r={8.028} fill="#fff" />
  </svg>
);
export default SvgMoonEclipse;
