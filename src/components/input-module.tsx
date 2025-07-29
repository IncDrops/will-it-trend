
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
import { LoaderCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

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
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: '',
      timeHorizon: '7 days',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'Could not verify user. Please refresh the page.',
        });
        setIsSubmitting(false);
        return;
    }

    try {
        const token = await user.getIdToken();
        const response = await fetch('/api/v1/trend-forecast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              input: values.input,
              timeHorizon: values.timeHorizon,
            }),
        });

        const result = await response.json();

      if (response.ok && result.success) {
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
                  Enter a trend, topic, or idea...
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'Cottagecore aesthetic' or '#TikTokMadeMeBuyIt'"
                    className="resize-none text-base"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <FormField
              control={form.control}
              name="timeHorizon"
              render={({ field }) => (
                <FormItem className="w-full sm:w-1/3">
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
                      <SelectItem value="24 hours">24 Hours</SelectItem>
                      <SelectItem value="7 days">7 Days</SelectItem>
                      <SelectItem value="30 days">30 Days</SelectItem>
                      <SelectItem value="90 days">90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" variant="shiny" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" />
                  Predicting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" />
                  Will This Trend?
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
