'use server';

import { trendForecast, type TrendForecastInput } from '@/ai/flows/trend-forecasting';

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
