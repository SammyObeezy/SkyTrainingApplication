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

export const UsersIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = 'currentColor', className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
        {/* Corrected tags below */}
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
export const DashboardIcon: React.FC<IconProps> = ({ width = 20, height = 20, color = 'currentColor', className }) => (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
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