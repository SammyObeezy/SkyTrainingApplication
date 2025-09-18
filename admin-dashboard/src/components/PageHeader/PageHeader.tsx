import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode; // To allow passing other components like controls
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <div className="page-header">
      <h1 className="page-header-title">{title}</h1>
      <div className="page-header-controls">
        {children}
      </div>
    </div>
  );
};