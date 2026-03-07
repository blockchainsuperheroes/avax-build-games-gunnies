import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

interface ButtonProps {
  twSize?: string;
  twBgIcon: string;
  className?: string;
  style?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
}

export const ButtonIcon = ({
  twSize = 'h-10 w-10',
  twBgIcon,
  className,
  style,
  href,
  target,
  ...props
}: ButtonProps) => {
  const defaultClassName = `cursor-pointer border-transparent bg-transparent bg-contain bg-no-repeat ${twSize} ${twBgIcon}`;
  const ButtonItem = (
    <button type="button" className={clsx(defaultClassName, className)} {...props}></button>
  );
  return !href ? (
    ButtonItem
  ) : (
    <Link target={target} rel={target === '_blank' ? 'noreferrer' : ''} href={href}>
      {ButtonItem}
    </Link>
  );
};
