import { config } from 'dotenv';
config();

import '@/ai/flows/generate-rationale.ts';
import '@/ai/flows/trend-forecasting.ts';
import '@/ai/flows/generate-captions';
import '@/ai/flows/find-hashtags';
import '@/ai/flows/best-time-to-post';
import '@/ai/flows/api-predict';
