import * as React from "react";
import type { SVGProps } from "react";
const SvgSunSupConjunction = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <circle cx={4} cy={20} r={2} fill="#fff" />
    <circle cx={20} cy={4} r={1} fill="#fff" />
    <path fill="none" stroke="#fff" strokeDasharray="1, 1" d="M6 18 18 6" />
    <path
      fill="#fff"
      d="m17.243 11-1.273 1.273L16 14h-1.8L13 15.243l-1.273-1.273L10 14v-1.8L8.757 11l1.273-1.273L10 8h1.8L13 6.757l1.273 1.273L16 8v1.8z"
    />
  </svg>
);
export default SvgSunSupConjunction;
