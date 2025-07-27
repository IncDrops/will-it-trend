
'use server';

import { trendForecast } from '@/ai/flows/trend-forecasting';
import { generateCaptions as genCaptions } from '@/ai/flows/generate-captions';
import { findHashtags as findTags } from '@/ai/flows/find-hashtags';
import { getBestTimeToPost as getBestTime } from '@/ai/flows/best-time-to-post';

import type { TrendForecastInput } from '@/ai/flows/trend-forecasting';
import type { GenerateCaptionsInput } from '@/ai/flows/generate-captions';
import type { FindHashtagsInput } from '@/ai/flows/find-hashtags';
import type { BestTimeToPostInput } from '@/ai/flows/best-time-to-post';

export async function getTrendForecast(
  input: TrendForecastInput
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const result = await trendForecast(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error('Error in getTrendForecast:', e);
    return {
      success: false,
      error: e.message || 'An unexpected error occurred.',
    };
  }
}

export async function generateCaptions(
  input: GenerateCaptionsInput
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const result = await genCaptions(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error('Error in callGenerateCaptions:', e);
    return {
      success: false,
      error: e.message || 'An unexpected error occurred.',
    };
  }
}

export async function findHashtags(
  input: FindHashtagsInput
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const result = await findTags(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error('Error in callFindHashtags:', e);
    return {
      success: false,
      error: e.message || 'An unexpected error occurred.',
    };
  }
}

export async function getBestTimeToPost(
  input: BestTimeToPostInput
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const result = await getBestTime(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error('Error in callGetBestTimeToPost:', e);
    return {
      success: false,
      error: e.message || 'An unexpected error occurred.',
    };
  }
}
