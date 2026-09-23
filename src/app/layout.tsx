import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Arnab Crafts | Custom Photo Frames', description: 'Customized photo frames from ₹149.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
