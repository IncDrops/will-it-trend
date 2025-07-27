'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { LoaderCircle, Sparkles, ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  callGenerateCaptions,
  callFindHashtags,
  callGetBestTimeToPost,
} from '@/lib/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';

// Schemas
const captionSchema = z.object({
  topic: z.string().min(5, 'Please describe your topic in at least 5 characters.'),
  tone: z.string(),
});

const hashtagSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic of at least 3 characters.'),
});

const postingTimeSchema = z.object({
  industry: z.string().min(3, 'Please select an industry.'),
  platform: z.string().min(1, 'Please select a platform.'),
});


export function AiTools() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('caption');

  // State for each tool
  const [captionState, setCaptionState] = useState<{ loading: boolean; results: string[] }>({ loading: false, results: [] });
  const [hashtagState, setHashtagState] = useState<{ loading: boolean; results: string[] }>({ loading: false, results: [] });
  const [postingTimeState, setPostingTimeState] = useState<{ loading: boolean; result: { time: string; reasoning: string; industry: string; platform: string } | null }>({ loading: false, result: null });

  // Forms
  const captionForm = useForm<z.infer<typeof captionSchema>>({
    resolver: zodResolver(captionSchema),
    defaultValues: { topic: '', tone: 'casual' },
  });

  const hashtagForm = useForm<z.infer<typeof hashtagSchema>>({
    resolver: zodResolver(hashtagSchema),
    defaultValues: { topic: '' },
  });

  const postingTimeForm = useForm<z.infer<typeof postingTimeSchema>>({
    resolver: zodResolver(postingTimeSchema),
    defaultValues: { industry: 'Tech', platform: 'TikTok' },
  });
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
    });
  };

  // Handlers
  const onCaptionSubmit = async (values: z.infer<typeof captionSchema>) => {
    setCaptionState({ loading: true, results: [] });
    try {
      const res = await callGenerateCaptions(values);
      if (res.success && res.data) {
        setCaptionState({ loading: false, results: res.data.captions });
      } else {
        throw new Error(res.error || 'Failed to generate captions.');
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
      setCaptionState({ loading: false, results: [] });
    }
  };

  const onHashtagSubmit = async (values: z.infer<typeof hashtagSchema>) => {
    setHashtagState({ loading: true, results: [] });
    try {
      const res = await callFindHashtags(values);
      if (res.success && res.data) {
        setHashtagState({ loading: false, results: res.data.hashtags });
      } else {
        throw new Error(res.error || 'Failed to find hashtags.');
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
      setHashtagState({ loading: false, results: [] });
    }
  };

  const onPostingTimeSubmit = async (values: z.infer<typeof postingTimeSchema>) => {
    setPostingTimeState({ loading: true, result: null });
    try {
      const res = await callGetBestTimeToPost(values);
      if (res.success && res.data) {
        setPostingTimeState({ loading: false, result: { ...res.data, ...values } });
      } else {
        throw new Error(res.error || 'Failed to get recommendation.');
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
      setPostingTimeState({ loading: false, result: null });
    }
  };
  

  return (
    <Tabs defaultValue="caption" className="max-w-2xl mx-auto" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="caption">Caption Generator</TabsTrigger>
        <TabsTrigger value="hashtags">Hashtag Finder</TabsTrigger>
        <TabsTrigger value="posting-time">Best Time to Post</TabsTrigger>
      </TabsList>

      {/* Caption Generator */}
      <TabsContent value="caption">
        <Card className="glassmorphic">
          <Form {...captionForm}>
            <form onSubmit={captionForm.handleSubmit(onCaptionSubmit)}>
              <CardHeader>
                <CardTitle>AI Caption Generator</CardTitle>
                <CardDescription>
                  Enter a topic and we'll generate 5 engaging captions for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={captionForm.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="topic">Topic or Idea</Label>
                      <FormControl>
                        <Textarea
                          id="topic"
                          placeholder="e.g., A new coffee brand launching a dark roast."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={captionForm.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Tone</Label>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                           <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="casual" id="r2" />
                            </FormControl>
                            <Label htmlFor="r2">Casual</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                             <FormControl>
                                <RadioGroupItem value="professional" id="r1" />
                             </FormControl>
                            <Label htmlFor="r1">Professional</Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                             <FormControl>
                                <RadioGroupItem value="witty" id="r3" />
                             </FormControl>
                            <Label htmlFor="r3">Witty</Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {captionState.loading && (
                    <div className="flex justify-center items-center p-8">
                        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                {captionState.results.length > 0 && (
                    <div className="space-y-3 pt-4">
                        <h4 className="font-semibold">Generated Captions:</h4>
                        {captionState.results.map((caption, i) => (
                            <div key={i} className="glassmorphic p-3 rounded-lg flex justify-between items-center text-sm">
                                <span>{caption}</span>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(caption)}>
                                    <ClipboardCopy className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" variant="shiny" disabled={captionState.loading}>
                  {captionState.loading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
                  Generate Captions
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>

      {/* Hashtag Finder */}
      <TabsContent value="hashtags">
        <Card className="glassmorphic">
            <Form {...hashtagForm}>
                <form onSubmit={hashtagForm.handleSubmit(onHashtagSubmit)}>
                    <CardHeader>
                        <CardTitle>AI Hashtag Finder</CardTitle>
                        <CardDescription>
                        Find trending and niche hashtags to boost your reach.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={hashtagForm.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="hashtag-topic">Topic or Keyword</Label>
                                    <FormControl>
                                        <Textarea
                                            id="hashtag-topic"
                                            placeholder="e.g., sustainable fashion"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         {hashtagState.loading && (
                            <div className="flex justify-center items-center p-8">
                                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}
                        {hashtagState.results.length > 0 && (
                            <div className="space-y-3 pt-4">
                                <h4 className="font-semibold">Recommended Hashtags:</h4>
                                <div className="glassmorphic p-4 rounded-lg flex flex-wrap gap-2">
                                    {hashtagState.results.map((tag, i) => (
                                        <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => copyToClipboard(`#${tag}`)}>#{tag}</Badge>
                                    ))}
                                </div>
                                 <Button variant="link" size="sm" onClick={() => copyToClipboard(hashtagState.results.map(t => `#${t}`).join(' '))}>Copy All</Button>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" variant="shiny" disabled={hashtagState.loading}>
                             {hashtagState.loading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
                            Find Hashtags
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
      </TabsContent>

       {/* Best Time To Post */}
      <TabsContent value="posting-time">
         <Card className="glassmorphic">
            <Form {...postingTimeForm}>
                <form onSubmit={postingTimeForm.handleSubmit(onPostingTimeSubmit)}>
                    <CardHeader>
                        <CardTitle>Best Time to Post</CardTitle>
                        <CardDescription>
                        Get a data-backed recommendation for when your audience is most active.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={postingTimeForm.control}
                                name="industry"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Industry</Label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select an industry" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Tech">Tech</SelectItem>
                                                <SelectItem value="Fashion">Fashion</SelectItem>
                                                <SelectItem value="Food">Food</SelectItem>
                                                <SelectItem value="Travel">Travel</SelectItem>
                                                <SelectItem value="Gaming">Gaming</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                             <FormField
                                control={postingTimeForm.control}
                                name="platform"
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Platform</Label>
                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="TikTok">TikTok</SelectItem>
                                                <SelectItem value="Instagram">Instagram</SelectItem>
                                                <SelectItem value="Twitter">Twitter</SelectItem>
                                                <SelectItem value="YouTube">YouTube</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                         </div>
                         {postingTimeState.loading && (
                            <div className="flex justify-center items-center p-8">
                                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}
                        {postingTimeState.result && (
                            <div className="pt-4 text-center">
                                <div className="glassmorphic rounded-lg p-6">
                                    <p className="text-lg font-semibold">Recommended Time for <span className="text-primary">{postingTimeState.result.industry}</span> on <span className="text-primary">{postingTimeState.result.platform}</span>:</p>
                                    <p className="text-4xl font-bold text-gradient mt-2">{postingTimeState.result.time}</p>
                                    <p className="text-sm text-muted-foreground">{postingTimeState.result.reasoning}</p>
                                </div>
                            </div>
                         )}

                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" variant="shiny" disabled={postingTimeState.loading}>
                             {postingTimeState.loading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
                           Analyze Best Times
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
