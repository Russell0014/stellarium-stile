import * as React from "react";
import type { SVGProps } from "react";
const SvgMoonLastQuarter = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <circle
      cx={12}
      cy={12}
      r={9}
      fill="none"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="bevel"
      strokeWidth={2}
    />
    <path
      fill="#fff"
      d="M12 3a9 9 0 0 1 7.794 4.5 9 9 0 0 1 0 9A9 9 0 0 1 12 21v-9z"
    />
  </svg>
);
export default SvgMoonLastQuarter;
