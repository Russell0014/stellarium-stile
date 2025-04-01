import * as React from "react";
import type { SVGProps } from "react";
const SvgSunInfConjunction = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <circle cx={4} cy={20} r={2} fill="#fff" />
    <circle cx={12} cy={12} r={1} fill="#fff" />
    <path fill="none" stroke="#fff" strokeDasharray="1, 1" d="M6 18 17 7" />
    <path
      fill="#fff"
      d="M23.043 5 21.77 6.273 21.8 8H20l-1.2 1.243-1.272-1.273L15.8 8V6.2L14.558 5l1.273-1.273L15.8 2h1.8L18.8.757l1.272 1.273L21.8 2v1.8z"
    />
  </svg>
);
export default SvgSunInfConjunction;
