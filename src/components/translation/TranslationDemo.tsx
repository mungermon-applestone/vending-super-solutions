import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

const TranslationDemo: React.FC = () => {
  const [testText, setTestText] = useState('Hello, this is a test translation.');
  const { currentLanguage, isTranslationEnabled } = useLanguage();
  
  const { translated, isLoading, error, isFromCache } = useTranslation(testText, {
    context: 'demo',
    enabled: testText.trim().length > 0
  });

  const handleTestTranslation = () => {
    setTestText(`Test at ${new Date().toLocaleTimeString()}: Welcome to our multilingual website!`);
  };

  if (!isTranslationEnabled) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Translation Demo</CardTitle>
          <CardDescription>
            Translation is only active for non-English languages. Switch to Spanish to see translations.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Translation Demo 
          {isFromCache && <CheckCircle className="h-5 w-5 text-green-500" />}
        </CardTitle>
        <CardDescription>
          Test the AI translation system (Current language: {currentLanguage})
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="test-text">Text to translate:</Label>
          <Input
            id="test-text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Enter text to translate..."
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleTestTranslation} variant="outline">
            Generate Test Text
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Original (English):</Label>
            <p className="p-3 bg-muted rounded-md text-sm">{testText}</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">
              Translated ({currentLanguage.toUpperCase()}):
            </Label>
            <div className="p-3 bg-muted rounded-md min-h-[60px] flex items-center">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Translating...</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Translation failed: {error.message}</span>
                </div>
              ) : (
                <div className="space-y-1 w-full">
                  <p className="text-sm">{translated}</p>
                  {isFromCache && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Loaded from cache
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationDemo;