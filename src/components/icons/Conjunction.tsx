import * as React from "react";
import type { SVGProps } from "react";
const SvgConjunction = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <circle cx={19} cy={5} r={3} fill="#fff" />
    <circle cx={15.5} cy={8.5} r={0.75} fill="#fff" />
    <circle cx={13.5} cy={10.5} r={0.75} fill="#fff" />
    <circle cx={10} cy={14} r={3} fill="#fff" />
    <circle cx={6.5} cy={17.5} r={0.75} fill="#fff" />
    <circle cx={4.5} cy={19.5} r={0.75} fill="#fff" />
    <circle cx={2.5} cy={21.5} r={0.75} fill="#fff" />
  </svg>
);
export default SvgConjunction;
