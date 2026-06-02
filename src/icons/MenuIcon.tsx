'use client';

import React from 'react';
import { createIcon } from './createIcon';

// menu
export const MenuIcon = createIcon('0 0 32 32', (color) => (
  <path d="M4 6H28V8H4V6ZM4 24H28V26H4V24ZM4 12H28V14H4V12ZM4 18H28V20H4V18Z" fill={color} />
));
