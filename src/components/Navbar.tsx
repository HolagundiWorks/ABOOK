import React from 'react';
import { BottomNavBar } from './navigation/BottomNavBar';
import { AppModulesConfig, FirmProfile } from '../types';

export type MainTabType = 
  | 'clients' 
  | 'proposals' 
  | 'siteUpdates' 
  | 'invoices' 
  | 'reminders' 
  | 'payments' 
  | 'expenses' 
  | 'salaries' 
  | 'books';

export { BottomNavBar };
