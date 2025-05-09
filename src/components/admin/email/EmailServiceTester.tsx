
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getEmailEnvironment } from '@/services/email/emailConfig';
import { createMailtoLink, formatEmailBody } from '@/services/email/emailService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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

  const env = getEmailEnvironment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTestResult(null);
    
    try {
      // Format the email body
      const formData = {
        name,
        email,
        message
      };
      
      const metadata = {
        'Sent from': 'Email Service Tester',
        'Date': new Date().toLocaleString()
      };
      
      const emailBody = formatEmailBody(formData, metadata);
      const emailSubject = `Email Service Test: ${subject}`;
      
      // Create and open mailto link
      const mailtoLink = createMailtoLink(emailSubject, emailBody, env.recipientEmail);
      window.location.href = mailtoLink;
      
      setTestResult({
        success: true,
        message: "Email client has been opened. Please send the email to complete the test."
      });
      
      toast({
        title: 'Test successful',
        description: 'Email client has been opened with test message',
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
            <li><span className="font-semibold">Environment:</span> {env.isDevelopment ? 'Development' : 'Production'}</li>
            <li><span className="font-semibold">Recipient:</span> {env.recipientEmail}</li>
            <li><span className="font-semibold">Sender:</span> {env.senderEmail}</li>
          </ul>
        </div>

        {/* Development Mode Info */}
        <Alert variant="default" className="bg-amber-50">
          <Info className="h-4 w-4" />
          <AlertTitle>Email Functionality</AlertTitle>
          <AlertDescription>
            <p>This application uses your default email client to send messages. When you click "Send Test Email", your email client will open with a pre-filled message.</p>
          </AlertDescription>
        </Alert>
        
        {/* Test Result */}
        {testResult && (
          <Alert variant={testResult.success ? "default" : "destructive"}>
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
          {isSending ? 'Opening Email Client...' : 'Send Test Email'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailServiceTester;
