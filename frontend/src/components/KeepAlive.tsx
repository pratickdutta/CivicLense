'use client';
import { useEffect } from 'react';

export function KeepAlive() {
  useEffect(() => {
    // Ping the health route every 2 minutes (120,000 ms) 
    // to keep the Vercel serverless function warm while the tab is open
    const interval = setInterval(() => {
      fetch('/api/health').catch(() => {});
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);
  
  return null;
}
