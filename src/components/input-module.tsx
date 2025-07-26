'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { getTrendForecast } from '@/lib/actions';
import { LoaderCircle, Sparkles } from 'lucide-react';

const formSchema = z.object({
  input: z
    .string()
    .min(10, {
      message: 'Please describe your idea in at least 10 characters.',
    })
    .max(200, {
      message: 'Your description must be 200 characters or less.',
    }),
  timeHorizon: z.string(),
});

type InputModuleProps = {
  onNewResult: (result: any) => void;
};

export function InputModule({ onNewResult }: InputModuleProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: '',
      timeHorizon: '7 days',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await getTrendForecast(values);

      if (result.success && result.data) {
        onNewResult({
          id: crypto.randomUUID(),
          query: values.input,
          timeHorizon: values.timeHorizon,
          ...result.data,
        });
        toast({
          title: '🚀 Forecast Generated!',
          description: 'Your trend analysis is ready.',
        });
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to get forecast.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative glassmorphic rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl shadow-primary/10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">
                  Describe an idea, hashtag, or product...
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A smart water bottle that tracks hydration and glows to remind you to drink."
                    className="resize-none text-base"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeHorizon"
            render={({ field }) => (
              <FormItem className="w-full md:w-1/3">
                <FormLabel>Time Horizon</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time horizon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="5 minutes">5 minutes</SelectItem>
                    <SelectItem value="1 hour">1 hour</SelectItem>
                    <SelectItem value="1 day">1 day</SelectItem>
                    <SelectItem value="7 days">7 days</SelectItem>
                    <SelectItem value="31 days">31 days</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <p className="text-xs text-muted-foreground">
                No sign-up needed. No data saved except for result delivery.
              </p>
            <Button type="submit" size="lg" variant="shiny" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Forecasting...
                </>
              ) : (
                <>
                  <Sparkles />
                  Check Trend 🚀 $1
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
