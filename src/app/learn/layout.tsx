import {LearningProvider} from '@/components/learning-provider';
import type {ReactNode} from 'react';
import './learning.css';
export default function LearningLayout({children}:{children:ReactNode}){return <LearningProvider>{children}</LearningProvider>;}
