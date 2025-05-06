
import { supabase } from '@/integrations/supabase/client';

// Initialize SendGrid (not needed in the frontend anymore as we use the edge function)
export const initSendGrid = () => {
  console.log('Using Supabase Edge Function for email sending');
};

// Send email function - now using the Supabase Edge Function
export const sendEmail = async (params: {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  form_type?: string;
  page_url?: string;
}) => {
  try {
    console.log('Sending email via Supabase Edge Function:', params);
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: params,
    });
    
    if (error) {
      console.error('Edge Function error:', error);
      throw new Error(error.message || 'Failed to send email');
    }
    
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};
