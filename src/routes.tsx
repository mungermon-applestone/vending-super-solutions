
import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { ErrorBoundary } from '@/components/common';

// Eagerly load critical components
import ErrorPage from '@/components/ErrorPage';
import RootLayout from '@/components/RootLayout';

// Loading fallback with transition delay to prevent flash
const PageLoading = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <Spinner size="lg" />
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh]">
    <h2 className="text-lg font-semibold text-red-600">Something went wrong:</h2>
    <p className="text-gray-700 mb-4">{error.message || 'Unknown error occurred'}</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-blue-600 text-white rounded-md"
    >
      Try again
    </button>
  </div>
);

// Optimized lazy loading with chunk names for better caching
const Index = lazy(() => import(/* webpackChunkName: "home-page" */ '@/pages/Index'));
const Products = lazy(() => import(/* webpackChunkName: "products-page" */ '@/pages/Products'));
const ProductDetailPage = lazy(() => import(/* webpackChunkName: "product-detail" */ '@/pages/ProductDetailPage'));
const MachinesPage = lazy(() => import(/* webpackChunkName: "machines-page" */ '@/pages/MachinesPage'));
const MachineDetailPage = lazy(() => import(/* webpackChunkName: "machine-detail" */ '@/pages/MachineDetailPage'));
const BusinessGoalsPage = lazy(() => import(/* webpackChunkName: "business-goals" */ '@/pages/BusinessGoalsPage'));
const BusinessGoalDetailPage = lazy(() => import(/* webpackChunkName: "business-goal-detail" */ '@/pages/BusinessGoalDetailPage'));
const BusinessGoalDetail = lazy(() => import(/* webpackChunkName: "legacy-goal-detail" */ '@/pages/BusinessGoalDetail')); // Old implementation
const NotFound = lazy(() => import(/* webpackChunkName: "not-found" */ '@/pages/NotFound'));
const TechnologyPage = lazy(() => import(/* webpackChunkName: "technology-page" */ '@/pages/TechnologyPage'));
const About = lazy(() => import(/* webpackChunkName: "about-page" */ '@/pages/About'));
const BlogPage = lazy(() => import(/* webpackChunkName: "blog-page" */ '@/pages/BlogPage'));
const ContentfulBlogPostDetail = lazy(() => import(/* webpackChunkName: "blog-post-detail" */ '@/pages/ContentfulBlogPostDetail'));
const Contact = lazy(() => import(/* webpackChunkName: "contact-page" */ '@/pages/Contact'));
const ZhilaiApplestoneAnnouncement = lazy(() => import(/* webpackChunkName: "announcement" */ '@/pages/ZhilaiApplestoneAnnouncement'));
const PrivacyPolicy = lazy(() => import(/* webpackChunkName: "privacy-policy" */ '@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import(/* webpackChunkName: "terms-of-service" */ '@/pages/TermsOfService'));
const AdminPage = lazy(() => import(/* webpackChunkName: "admin-redirect" */ '@/pages/AdminPage'));

// Enhanced wrapper for lazy-loaded components with error boundary
const LazyPageWithBoundary = ({ component: Component }) => (
  <ErrorBoundary
    fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
        <p className="text-red-700 mb-3">An unexpected error occurred</p>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    }
  >
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

// Main route definitions
const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LazyPageWithBoundary component={Index} />
      },
      {
        path: 'products',
        element: <LazyPageWithBoundary component={Products} />
      },
      {
        path: 'products/:slug',
        element: <LazyPageWithBoundary component={ProductDetailPage} />
      },
      {
        path: 'machines',
        element: <LazyPageWithBoundary component={MachinesPage} />
      },
      {
        path: 'machines/:slug',
        element: <LazyPageWithBoundary component={MachineDetailPage} />
      },
      {
        path: 'machines/:machineType/:machineId',
        element: <LazyPageWithBoundary component={MachineDetailPage} />
      },
      {
        path: 'technology',
        element: <LazyPageWithBoundary component={TechnologyPage} />
      },
      {
        path: 'business-goals',
        element: <LazyPageWithBoundary component={BusinessGoalsPage} />
      },
      {
        path: 'business-goals/:slug',
        element: <LazyPageWithBoundary component={BusinessGoalDetailPage} />
      },
      {
        path: 'goals/:slug',
        element: <LazyPageWithBoundary component={BusinessGoalDetail} />
      },
      {
        path: 'business/:slug',
        element: <LazyPageWithBoundary component={BusinessGoalDetailPage} />
      },
      {
        path: 'about',
        element: <LazyPageWithBoundary component={About} />
      },
      {
        path: 'blog',
        element: <LazyPageWithBoundary component={BlogPage} />
      },
      {
        path: 'blog/:slug',
        element: <LazyPageWithBoundary component={ContentfulBlogPostDetail} />
      },
      {
        path: 'blog/zhilai-applestone-announcement',
        element: <LazyPageWithBoundary component={ZhilaiApplestoneAnnouncement} />
      },
      {
        path: 'contact',
        element: <LazyPageWithBoundary component={Contact} />
      },
      {
        path: 'privacy',
        element: <LazyPageWithBoundary component={PrivacyPolicy} />
      },
      {
        path: 'terms',
        element: <LazyPageWithBoundary component={TermsOfService} />
      },
      {
        path: 'admin/*',
        element: <LazyPageWithBoundary component={AdminPage} />
      },
      {
        path: '*',
        element: <LazyPageWithBoundary component={NotFound} />
      }
    ]
  }
];

export default routes;
