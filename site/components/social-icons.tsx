import type { SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function Github({ size = 24, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.09c-3.11.68-3.77-1.32-3.77-1.32-.51-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.6 1.21 3.24.92.1-.72.39-1.21.71-1.49-2.48-.28-5.1-1.24-5.1-5.54 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.73 10.73 0 0 1 5.6 0c2.14-1.45 3.07-1.15 3.07-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.31-2.62 5.26-5.12 5.53.4.35.76 1.03.76 2.08v3.07c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg>;
}
export function Linkedin({ size = 24, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2a5 5 0 0 1 2-3Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
}
