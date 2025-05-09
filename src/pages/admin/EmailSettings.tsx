
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emailConfig, getEmailEnvironment } from '@/services/email/emailConfig';
import EmailServiceTester from '@/components/admin/email/EmailServiceTester';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { getSendGridConfigStatus } from '@/services/email/sendGridService';

const EmailSettings: React.FC = () => {
  const env = getEmailEnvironment();
  const configStatus = getSendGridConfigStatus();
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Email Settings</h1>
        
        <Tabs defaultValue="configuration" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="test">Test Email</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="configuration">
            <div className="grid gap-6">
              {/* Current Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Email Configuration</CardTitle>
                  <CardDescription>
                    Review your current email service configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-md font-semibold mb-2">Provider Settings</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Provider:</span>
                            <span className="font-medium">{emailConfig.provider}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Environment:</span>
                            <span className="font-medium">{env.isDevelopment ? 'Development' : 'Production'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Log Emails:</span>
                            <span className="font-medium">{env.logEmails ? 'Yes' : 'No'}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-md font-semibold mb-2">Email Addresses</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">From:</span>
                            <span className="font-medium">{env.senderEmail}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">To:</span>
                            <span className="font-medium">{env.recipientEmail}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Configuration Status */}
                    {emailConfig.provider === 'SENDGRID' && (
                      <Alert variant={configStatus.isConfigured ? "default" : "destructive"} className="mt-4">
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
                              <p className="mt-2">
                                Set these environment variables in your project's environment settings.
                              </p>
                            </>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Development Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Development Settings</CardTitle>
                  <CardDescription>
                    Configure how emails behave in development environments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Log Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          In development mode, log emails to console instead of sending them
                        </p>
                      </div>
                      <Switch
                        checked={emailConfig.developmentMode.logEmails}
                        disabled
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Force Development Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Force development mode regardless of environment
                        </p>
                      </div>
                      <Switch
                        checked={emailConfig.developmentMode.forceDevelopmentMode}
                        disabled
                      />
                    </div>
                    
                    <Alert variant="default" className="bg-amber-50 mt-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Environment Configuration</AlertTitle>
                      <AlertDescription>
                        <p>These settings can be modified in the <code>src/services/email/emailConfig.ts</code> file.</p>
                        <p className="mt-2">To enable changes to these settings at runtime, you would need to implement a server-side configuration component.</p>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
              
              {/* Environment Variables Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Environment Variables</CardTitle>
                  <CardDescription>
                    Required environment variables for email functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      The following environment variables need to be set in your project environment:
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <pre className="text-sm whitespace-pre-wrap">
                        <code>
                          SENDGRID_API_KEY=your_sendgrid_api_key{"\n"}
                          EMAIL_TO=recipient@example.com{"\n"}
                          EMAIL_FROM=sender@example.com
                        </code>
                      </pre>
                    </div>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Setting Environment Variables</AlertTitle>
                      <AlertDescription>
                        <p>These variables should be set in your project's environment settings.</p>
                        <p className="mt-2">For local development, add these to your environment variables in your development platform.</p>
                        <p className="mt-2">For production, add these to your deployment platform's environment variables.</p>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="test">
            <EmailServiceTester />
          </TabsContent>
          
          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>Email Implementation Documentation</CardTitle>
                <CardDescription>
                  How to use and configure the email service in your application
                </CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <h2>Email Service Implementation</h2>
                <p>
                  The application implements a flexible email system with support for multiple providers. 
                  Currently, there are two supported methods:
                </p>
                
                <ul>
                  <li><strong>SendGrid Direct Integration</strong> - Recommended for production</li>
                  <li><strong>Legacy API Endpoint</strong> - For backward compatibility</li>
                </ul>
                
                <h3>Using Email Functionality in Components</h3>
                <p>To send emails from your components:</p>
                
                <pre className="bg-gray-50 p-3 rounded-md">
                  <code>
                    {`import { sendEmail } from '@/services/email/emailAdapter';

// In your component:
const result = await sendEmail({
  name: 'User Name',
  email: 'user@example.com',
  subject: 'Subject Line',
  message: 'Email message content',
  formType: 'Contact Form',
  location: window.location.pathname
});

if (result.success) {
  // Handle success
} else {
  // Handle error
}`}
                  </code>
                </pre>
                
                <h3>Configuration</h3>
                <p>
                  Email configuration is managed in <code>src/services/email/emailConfig.ts</code>. 
                  The main configuration options include:
                </p>
                
                <ul>
                  <li><strong>provider</strong>: 'SENDGRID' or 'ADAPTER'</li>
                  <li><strong>defaultRecipient</strong>: Default recipient email</li>
                  <li><strong>defaultSender</strong>: Default sender email</li>
                  <li><strong>developmentMode</strong>: Settings for development environments</li>
                </ul>
                
                <h3>Environment Variables</h3>
                <p>The following environment variables are used:</p>
                
                <ul>
                  <li><strong>SENDGRID_API_KEY</strong>: Your SendGrid API key</li>
                  <li><strong>EMAIL_TO</strong>: Recipient email address (overrides default)</li>
                  <li><strong>EMAIL_FROM</strong>: Sender email address (overrides default)</li>
                </ul>
                
                <h3>Development vs Production</h3>
                <p>
                  In development mode, emails are logged to the console instead of being sent. 
                  This behavior can be configured in the email configuration file.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default EmailSettings;
