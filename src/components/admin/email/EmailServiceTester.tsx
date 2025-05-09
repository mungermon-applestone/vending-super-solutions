
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getSendGridConfigStatus } from '@/services/email/sendGridService';
import { sendEmail } from '@/services/email/emailAdapter';
import { emailConfig, getEmailEnvironment } from '@/services/email/emailConfig';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const EmailServiceTester: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('Test User');
  const [email, setEmail] = useState('test@example.com');
  const [message, setMessage] = useState('This is a test message from the Email Service Tester.');
  const [subject, setSubject] = useState('Email Service Test');
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const configStatus = getSendGridConfigStatus();
  const env = getEmailEnvironment();
  const isUsingDirectSendGrid = emailConfig.provider === 'SENDGRID';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTestResult(null);
    
    try {
      const result = await sendEmail({
        name,
        email,
        subject,
        message,
        formType: 'Email Service Test',
        location: 'Email Service Tester'
      });
      
      setTestResult(result);
      
      toast({
        title: result.success ? 'Test successful' : 'Test failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error testing email service:', error);
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      
      toast({
        title: 'Test failed',
        description: 'An unexpected error occurred while testing the email service',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Email Service Tester</CardTitle>
        <CardDescription>
          Test your email configuration by sending a test message
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Configuration Status */}
        <div className="rounded-md border p-4">
          <div className="font-medium mb-2">Current configuration:</div>
          <ul className="space-y-1 text-sm">
            <li><span className="font-semibold">Email Provider:</span> {emailConfig.provider}</li>
            <li><span className="font-semibold">Environment:</span> {env.isDevelopment ? 'Development' : 'Production'}</li>
            <li><span className="font-semibold">Log Emails:</span> {env.logEmails ? 'Yes' : 'No'}</li>
            <li><span className="font-semibold">Recipient:</span> {env.recipientEmail}</li>
            <li><span className="font-semibold">Sender:</span> {env.senderEmail}</li>
          </ul>
        </div>

        {/* SendGrid Configuration Status */}
        {isUsingDirectSendGrid && (
          <Alert variant={configStatus.isConfigured ? "default" : "destructive"}>
            {configStatus.isConfigured ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              SendGrid {configStatus.isConfigured ? 'is properly configured' : 'is not fully configured'}
            </AlertTitle>
            <AlertDescription>
              {configStatus.isConfigured ? (
                <p>All required environment variables are set.</p>
              ) : (
                <>
                  <p>Missing environment variables:</p>
                  <ul className="list-disc list-inside mt-2">
                    {configStatus.missingEnvVars.map(envVar => (
                      <li key={envVar}>{envVar}</li>
                    ))}
                  </ul>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Development Mode Warning */}
        {env.isDevelopment && (
          <Alert variant="default" className="bg-amber-50">
            <Info className="h-4 w-4" />
            <AlertTitle>Development Mode Active</AlertTitle>
            <AlertDescription>
              <p>In development mode, emails are logged to the console instead of being sent.</p>
              <p className="mt-2">Check your browser console after submitting the test form.</p>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Test Result */}
        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
            {testResult.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {testResult.success ? 'Test Successful' : 'Test Failed'}
            </AlertTitle>
            <AlertDescription>
              {testResult.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Test Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <FormControl>
              <Input 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </FormControl>
          </FormItem>
          
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl>
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
              />
            </FormControl>
          </FormItem>
        </form>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSending} className="w-full">
          {isSending ? 'Sending...' : 'Send Test Email'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailServiceTester;
