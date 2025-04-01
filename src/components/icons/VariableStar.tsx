import * as React from "react";
import type { SVGProps } from "react";
const SvgVariableStar = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <circle cx={12} cy={12} r={5.635} fill="#fff" />
    <circle
      cx={12}
      cy={12}
      r={7.747}
      fill="none"
      stroke="#fff"
      strokeWidth={0.274}
    />
    <circle
      cx={12}
      cy={12}
      r={6.651}
      fill="none"
      stroke="#fff"
      strokeWidth={0.903}
    />
  </svg>
);
export default SvgVariableStar;
