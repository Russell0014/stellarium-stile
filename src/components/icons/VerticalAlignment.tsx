import * as React from "react";
import type { SVGProps } from "react";
const SvgVerticalAlignment = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <circle cx={12} cy={19} r={2} fill="#fff" />
    <path fill="none" stroke="#fff" strokeDasharray="1, 1" d="M12 16.5V7" />
    <circle cx={12} cy={5} r={2} fill="#fff" />
    <path fill="#fff" d="m11 8 1-1 1 1zM13 16l-1 1-1-1z" />
  </svg>
);
export default SvgVerticalAlignment;
