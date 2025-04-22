
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useBusinessGoalsPageContent } from '@/hooks/cms/useBusinessGoalsPageContent';
import { useFeaturedBusinessGoalsContent } from '@/hooks/cms/useFeaturedBusinessGoalsContent';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';

const BusinessGoalsLanding = () => {
  const { data: featuredContent, isLoading, error } = useFeaturedBusinessGoalsContent();
  const { data: pageContent } = useBusinessGoalsPageContent();
  const { data: testimonialSection } = useTestimonialSection('business-goals');
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <TechnologyPageHero entryId="4b40Npa9Hgp8jO0jDX98F6" />

      {/* Intro Section */}
      {pageContent && (
        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {pageContent.introTitle}
            </h2>
            <p className="text-lg text-gray-600">
              {pageContent.introDescription}
            </p>
          </div>
        </section>
      )}

      {/* Featured Business Goals Grid */}
      <div className="container mx-auto py-12">
        {featuredContent && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {featuredContent.title}
            </h2>
            {featuredContent.description && (
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {featuredContent.description}
              </p>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Business Goals</h3>
            <p className="text-gray-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          </div>
        ) : featuredContent?.businessGoals && featuredContent.businessGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredContent.businessGoals.filter(goal => goal.visible !== false).map((goal) => (
              <Card key={goal.id} className="group hover:border-vending-blue transition-colors duration-300">
                <CardHeader>
                  {goal.icon && (
                    <div className="bg-vending-blue/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <ArrowRight className="h-6 w-6 text-vending-blue" />
                    </div>
                  )}
                  <CardTitle className="text-xl">{goal.title}</CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="p-0 hover:bg-transparent text-vending-blue font-medium"
                    onClick={() => navigate(`/business/${goal.slug}`)}
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Business Goals</h3>
            <p className="text-gray-600">Check back later for information about our business solutions.</p>
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      {testimonialSection && <TestimonialsSection data={testimonialSection} />}
      
      {/* Custom Solution CTA Section */}
      {pageContent?.customSolutionTitle && (
        <section className="bg-vending-gray py-16">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {pageContent.customSolutionTitle}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {pageContent.customSolutionDescription}
            </p>
            {pageContent.customSolutionButtonText && (
              <Button asChild size="lg">
                <a href={pageContent.customSolutionButtonUrl || '#'}>
                  {pageContent.customSolutionButtonText}
                </a>
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Inquiry Form */}
      <InquiryForm title="Ready to achieve your business goals?" />
    </Layout>
  );
};

export default BusinessGoalsLanding;
