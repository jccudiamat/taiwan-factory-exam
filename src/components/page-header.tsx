import type { ReactNode } from 'react';
import { hasPageSharing } from '@/lib/sharing';
import { PageShare } from './page-share';

export function PageHeader({path, children, className = '', share, shareLabel}: {
  path: string;
  children: ReactNode;
  className?: string;
  share?: boolean;
  shareLabel?: string;
}) {
  const showShare = share ?? hasPageSharing(path);
  return <header className={`page-header${showShare ? ' page-header-with-share' : ''}${className ? ` ${className}` : ''}`}>
    <div className="page-header-copy">{children}</div>
    {showShare ? <PageShare key={path} path={path} label={shareLabel}/> : null}
  </header>;
}
