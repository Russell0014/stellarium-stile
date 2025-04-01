import * as React from "react";
import type { SVGProps } from "react";
const SvgMoonNew = (props: SVGProps<SVGSVGElement>) => (
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
  </svg>
);
export default SvgMoonNew;
