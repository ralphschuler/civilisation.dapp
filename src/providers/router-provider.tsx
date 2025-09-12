'use client';

import { type ReactNode } from 'react';
import { HashRouter } from 'react-router-dom';

export const RouterProvider = (props: { children: ReactNode }) => {
  return <>
    <HashRouter
      basename={process.env.NEXT_PUBLIC_BASE_PATH || '/'}
    >
      {props.children}
    </HashRouter>
  </>;
};
