
'use client';

import { useState } from 'react';
import { ClipboardCopy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type CodeBlockProps = {
  code: string;
  language: 'bash' | 'json' | 'typescript' | 'python';
  className?: string;
};

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setHasCopied(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  return (
    <div className={cn("relative group", className)}>
      <pre className="bg-card/80 text-sm p-4 rounded-lg overflow-x-auto border border-border/20">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
      >
        {hasCopied ? <Check className="text-green-500" /> : <ClipboardCopy />}
      </Button>
    </div>
  );
}
