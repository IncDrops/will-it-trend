'use client';

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
import { Sparkles } from 'lucide-react';

export function AiTools() {
  return (
    <Tabs defaultValue="caption" className="max-w-2xl mx-auto">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="caption">Caption Generator</TabsTrigger>
        <TabsTrigger value="hashtags">Hashtag Finder</TabsTrigger>
        <TabsTrigger value="posting-time">Best Time to Post</TabsTrigger>
      </TabsList>
      <TabsContent value="caption">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>AI Caption Generator</CardTitle>
            <CardDescription>
              Enter a topic and we'll generate 5 engaging captions for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or Idea</Label>
              <Textarea
                id="topic"
                placeholder="e.g., A new coffee brand launching a dark roast."
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <RadioGroup defaultValue="professional" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="r1" />
                  <Label htmlFor="r1">Professional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="casual" id="r2" />
                  <Label htmlFor="r2">Casual</Label>
                </div>
                 <div className="flex items-center space-x-2">
                  <RadioGroupItem value="witty" id="r3" />
                  <Label htmlFor="r3">Witty</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="shiny">
              <Sparkles className="mr-2" />
              Generate Captions
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
       <TabsContent value="hashtags">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>AI Hashtag Finder</CardTitle>
            <CardDescription>
              Find trending and niche hashtags to boost your reach.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="hashtag-topic">Topic or Keyword</Label>
              <Textarea
                id="hashtag-topic"
                placeholder="e.g., sustainable fashion"
              />
            </div>
          </CardContent>
          <CardFooter>
             <Button className="w-full" variant="shiny">
              <Sparkles className="mr-2" />
              Find Hashtags
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="posting-time">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Best Time to Post</CardTitle>
            <CardDescription>
              Get data-backed recommendations for when your audience is most active.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">This feature analyzes your industry and platform to suggest optimal posting times.</p>
             <div className="glassmorphic rounded-lg p-6">
                <p className="text-lg font-semibold">Recommended Time for <span className="text-primary">Tech</span> on <span className="text-primary">TikTok</span>:</p>
                <p className="text-4xl font-bold text-gradient mt-2">9:00 AM EST</p>
                <p className="text-sm text-muted-foreground">(Highest engagement on Tuesdays)</p>
            </div>
          </CardContent>
          <CardFooter>
             <Button className="w-full" variant="shiny">
              <Sparkles className="mr-2" />
              Analyze Best Times
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
