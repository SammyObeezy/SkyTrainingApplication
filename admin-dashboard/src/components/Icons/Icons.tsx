import React from 'react';

// A generic interface for styling the icons via props
interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

// --- NEW ICONS ---

export const CancelIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = 'currentColor', className }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill={color} 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
  </svg>
);

export const FilterIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = 'currentColor', className }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 19 13" 
    fill={color} 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M3.61743 7.0542H15.6174V5.0542H3.61743M0.617432 0.0541992V2.0542H18.6174V0.0541992M7.61743 12.0542H11.6174V10.0542H7.61743V12.0542Z" />
  </svg>
);

export const SortIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = 'currentColor', className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={width} 
    height={height} 
    viewBox="0 0 640 640" 
    fill={color}
    className={className}
  >
    <path d="M278.6 438.6L182.6 534.6C170.1 547.1 149.8 547.1 137.3 534.6L41.3 438.6C28.8 426.1 28.8 405.8 41.3 393.3C53.8 380.8 74.1 380.8 86.6 393.3L128 434.7V128c0-17.7 14.3-32 32-32s32 14.3 32 32v306.7L233.4 393.3c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3zM352 96h32c17.7 0 32 14.3 32 32s-14.3 32-32 32h-32c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h96c17.7 0 32 14.3 32 32s-14.3 32-32 32h-96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h160c17.7 0 32 14.3 32 32s-14.3 32-32 32H352c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 128h224c17.7 0 32 14.3 32 32s-14.3 32-32 32H352c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/>
  </svg>
);

// --- EXISTING ICONS ---

export const UsersIcon: React.FC<IconProps> = ({ width = 20, height = 20 }) => (
    <svg width={width} height={height} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 17.128C14.853 17.3754 15.7368 17.5006 16.625 17.5C18.0536 17.5034 19.4637 17.1776 20.746 16.548C20.7487 16.4907 20.75 16.433 20.75 16.375C20.7501 15.4929 20.4674 14.634 19.9434 13.9244C19.4194 13.2147 18.6818 12.6918 17.8387 12.4322C16.9956 12.1727 16.0916 12.1902 15.2592 12.4823C14.4269 12.7744 13.71 13.3256 13.214 14.055M14 17.128V17.125C14 16.012 13.715 14.965 13.214 14.055M14 17.128V17.234C12.0758 18.3939 9.87073 19.0047 7.624 19C5.293 19 3.112 18.355 1.25 17.234L1.249 17.125C1.24823 15.7095 1.71861 14.3339 2.58598 13.2153C3.45335 12.0966 4.66837 11.2984 6.03949 10.9466C7.4106 10.5948 8.85982 10.7093 10.1587 11.2721C11.4575 11.8349 12.5331 12.814 13.214 14.055M11 4.375C11 5.27011 10.6444 6.12855 10.0115 6.76149C9.37855 7.39442 8.52011 7.75 7.625 7.75C6.72989 7.75 5.87145 7.39442 5.23851 6.76149C4.60558 6.12855 4.25 5.27011 4.25 4.375C4.25 3.47989 4.60558 2.62145 5.23851 1.98851C5.87145 1.35558 6.72989 1 7.625 1C8.52011 1 9.37855 1.35558 10.0115 1.98851C10.6444 2.62145 11 3.47989 11 4.375ZM19.25 6.625C19.25 7.32119 18.9734 7.98887 18.4812 8.48116C17.9889 8.97344 17.3212 9.25 16.625 9.25C15.9288 9.25 15.2611 8.97344 14.7688 8.48116C14.2766 7.98887 14 7.32119 14 6.625C14 5.92881 14.2766 5.26113 14.7688 4.76884C15.2611 4.27656 15.9288 4 16.625 4C17.3212 4 17.9889 4.27656 18.4812 4.76884C18.9734 5.26113 19.25 5.92881 19.25 6.625Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SubjectsIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = 'currentColor', className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);

export const TasksIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = 'currentColor', className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = 'currentColor', className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

export const DashboardIcon: React.FC<IconProps> = ({ width = 20, height = 20 }) => (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.272 0.00398487C11.1717 0.00104066 11.0718 0.0182641 10.9782 0.0546347C10.8847 0.0910054 10.7994 0.145783 10.7274 0.215723C10.6554 0.285662 10.5982 0.36934 10.5591 0.461798C10.5201 0.554257 10.5 0.653615 10.5 0.753985V8.74998C10.5 9.16398 10.836 9.49998 11.25 9.49998H19.246C19.3464 9.50003 19.4457 9.47992 19.5382 9.44086C19.6306 9.4018 19.7143 9.34459 19.7843 9.27259C19.8542 9.2006 19.909 9.11531 19.9454 9.02176C19.9817 8.92821 19.9989 8.82831 19.996 8.72798C19.9267 6.43617 18.9854 4.25721 17.3641 2.63592C15.7428 1.01462 13.5638 0.0732526 11.272 0.00398487ZM12 7.99998V1.56598C13.6291 1.78564 15.141 2.53418 16.3034 3.69656C17.4658 4.85895 18.2143 6.37087 18.434 7.99998H12ZM9 2.78398C9 2.67985 8.97831 2.57685 8.93632 2.48155C8.89432 2.38625 8.83294 2.30075 8.75609 2.23047C8.67923 2.1602 8.58858 2.10671 8.48991 2.07339C8.39125 2.04008 8.28672 2.02768 8.183 2.03699C6.47967 2.19228 4.85585 2.82974 3.50176 3.87468C2.14768 4.91962 1.11938 6.32878 0.537329 7.93709C-0.0447226 9.54541 -0.156429 11.2863 0.215295 12.9558C0.587019 14.6253 1.42678 16.1543 2.63621 17.3638C3.84565 18.5732 5.37467 19.413 7.04419 19.7847C8.7137 20.1564 10.4546 20.0447 12.0629 19.4627C13.6712 18.8806 15.0804 17.8523 16.1253 16.4982C17.1702 15.1441 17.8077 13.5203 17.963 11.817C17.9723 11.7133 17.9599 11.6087 17.9266 11.5101C17.8933 11.4114 17.8398 11.3208 17.7695 11.2439C17.6992 11.167 17.6137 11.1057 17.5184 11.0637C17.4231 11.0217 17.3201 11 17.216 11H9V2.78398ZM1.5 11C1.49965 9.27101 2.09667 7.595 3.19004 6.25563C4.28341 4.91626 5.80595 3.99578 7.5 3.64999V11.75C7.5 12.164 7.836 12.5 8.25 12.5H16.35C15.9799 14.3227 14.9457 15.9429 13.4482 17.046C11.9507 18.1491 10.0968 18.6565 8.24626 18.4696C6.39574 18.2826 4.6807 17.4148 3.43406 16.0345C2.18742 14.6542 1.49813 12.8599 1.5 11Z" fill="white" />
    </svg>
);

export const ViewIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = 'currentColor', className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export const EditIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = 'currentColor', className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = '#dc3545', className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);