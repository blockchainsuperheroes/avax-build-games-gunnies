import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface ViewProps {
  children?: ReactNode;
  className?: string;
}

export const View = ({ children, className }: ViewProps) => {
  const defaultClassName = '';
  return <div className={clsx(defaultClassName, className)}>{children}</div>;
};
