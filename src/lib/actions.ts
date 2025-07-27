
'use server';
import 'dotenv/config';

import { trendForecast } from '@/ai/flows/trend-forecasting';
import { generateCaptions as genCaptions } from '@/ai/flows/generate-captions';
import { findHashtags as findTags } from '@/ai/flows/find-hashtags';
import { getBestTimeToPost as getBestTime } from '@/ai/flows/best-time-to-post';

import type { TrendForecastInput } from '@/ai/flows/trend-forecasting';
import type { GenerateCaptionsInput } from '@/ai/flows/generate-captions';
import type { FindHashtagsInput } from '@/ai/flows/find-hashtags';
import type { BestTimeToPostInput } from '@/ai/flows/best-time-to-post';

import { headers } from 'next/headers';
import { db } from '@/lib/firebase-admin';

const FREE_TIER_LIMIT = 2; // 2 requests per day

export async function getTrendForecast(
  input: TrendForecastInput
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const headersList = headers();
    const ip = (headersList.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const usageDocRef = db.collection('usage').doc(`${ip}_${today}`);
    const usageDoc = await usageDocRef.get();

    if (usageDoc.exists && usageDoc.data()?.count >= FREE_TIER_LIMIT) {
      return {
        success: false,
        error: 'You have exceeded the free daily limit of 2 trend reports.',
      };
    }

    const result = await trendForecast(input);
    
    // Increment usage count on successful forecast
    const currentCount = usageDoc.exists ? usageDoc.data()?.count : 0;
    await usageDocRef.set({ count: currentCount + 1, lastRequest: new Date() }, { merge: true });


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
