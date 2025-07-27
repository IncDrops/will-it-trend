'use server';

import { trendForecast, type TrendForecastInput } from '@/ai/flows/trend-forecasting';
import { generateCaptions, type GenerateCaptionsInput } from '@/ai/flows/generate-captions';
import { findHashtags, type FindHashtagsInput } from '@/ai/flows/find-hashtags';
import { getBestTimeToPost, type BestTimeToPostInput } from '@/ai/flows/best-time-to-post';


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

export async function callGenerateCaptions(
  input: GenerateCaptionsInput
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const result = await generateCaptions(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error('Error in callGenerateCaptions:', e);
    return {
      success: false,
      error: e.message || 'An unexpected error occurred.',
    };
  }
}

export async function callFindHashtags(
  input: FindHashtagsInput
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const result = await findHashtags(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error('Error in callFindHashtags:', e);
    return {
      success: false,
      error: e.message || 'An unexpected error occurred.',
    };
  }
}

export async function callGetBestTimeToPost(
  input: BestTimeToPostInput
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const result = await getBestTimeToPost(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error('Error in callGetBestTimeToPost:', e);
    return {
      success: false,
      error: e.message || 'An unexpected error occurred.',
    };
  }
}
