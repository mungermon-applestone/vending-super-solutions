import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import AdminLayout from '@/components/AdminLayout';
import { adminRoutes } from '@/router/adminRoutes';
import RootLayout from '@/components/RootLayout';
import { Spinner } from '@/components/ui/spinner';

// Lazy loaded components
const Index = lazy(() => import('@/pages/Index'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const MachinesPage = lazy(() => import('@/pages/MachinesPage'));
const MachineDetailPage = lazy(() => import('@/pages/MachineDetailPage'));
const BusinessGoalsPage = lazy(() => import('@/pages/BusinessGoalsPage'));
const BusinessGoalDetailPage = lazy(() => import('@/pages/BusinessGoalDetailPage'));
const BusinessGoalDetail = lazy(() => import('@/pages/BusinessGoalDetail')); // Old implementation
const NotFound = lazy(() => import('@/pages/NotFound'));
const TechnologyPage = lazy(() => import('@/pages/TechnologyPage'));
const About = lazy(() => import('@/pages/About'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const ContentfulBlogPostDetail = lazy(() => import('@/pages/ContentfulBlogPostDetail'));
const Contact = lazy(() => import('@/pages/Contact'));
const StrapiSetupPage = lazy(() => import('@/pages/admin/StrapiSetupPage'));
const ZhilaiApplestoneAnnouncement = lazy(() => import('@/pages/ZhilaiApplestoneAnnouncement'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const ContentfulConfigurationPage = lazy(() => import('@/pages/ContentfulConfigurationPage'));
const EnvironmentVariablesPage = lazy(() => import('@/pages/admin/EnvironmentVariablesPage'));

// Loading fallback
const PageLoading = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <Spinner size="lg" />
  </div>
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoading />}>
            <Index />
          </Suspense>
        )
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Products />
          </Suspense>
        )
      },
      {
        path: 'products/:slug',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ProductDetailPage />
          </Suspense>
        )
      },
      {
        path: 'machines',
        element: (
          <Suspense fallback={<PageLoading />}>
            <MachinesPage />
          </Suspense>
        )
      },
      {
        path: 'machines/:slug',
        element: (
          <Suspense fallback={<PageLoading />}>
            <MachineDetailPage />
          </Suspense>
        )
      },
      {
        path: 'machines/:machineType/:machineId',
        element: (
          <Suspense fallback={<PageLoading />}>
            <MachineDetailPage />
          </Suspense>
        )
      },
      {
        path: 'technology',
        element: (
          <Suspense fallback={<PageLoading />}>
            <TechnologyPage />
          </Suspense>
        )
      },
      {
        path: 'business-goals',
        element: (
          <Suspense fallback={<PageLoading />}>
            <BusinessGoalsPage />
          </Suspense>
        )
      },
      {
        path: 'business-goals/:slug',
        element: (
          <Suspense fallback={<PageLoading />}>
            <BusinessGoalDetailPage />
          </Suspense>
        )
      },
      {
        path: 'goals/:slug',
        element: (
          <Suspense fallback={<PageLoading />}>
            <BusinessGoalDetail />
          </Suspense>
        )
      },
      {
        path: 'business/:slug',
        element: (
          <Suspense fallback={<PageLoading />}>
            <BusinessGoalDetailPage />
          </Suspense>
        )
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoading />}>
            <About />
          </Suspense>
        )
      },
      {
        path: 'blog',
        element: (
          <Suspense fallback={<PageLoading />}>
            <BlogPage />
          </Suspense>
        )
      },
      {
        path: 'blog/:slug',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ContentfulBlogPostDetail />
          </Suspense>
        )
      },
      {
        path: 'blog/zhilai-applestone-announcement',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ZhilaiApplestoneAnnouncement />
          </Suspense>
        )
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Contact />
          </Suspense>
        )
      },
      {
        path: 'privacy',
        element: (
          <Suspense fallback={<PageLoading />}>
            <PrivacyPolicy />
          </Suspense>
        )
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<PageLoading />}>
            <TermsOfService />
          </Suspense>
        )
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoading />}>
            <NotFound />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdminPage />
          </Suspense>
        )
      },
      {
        path: 'contentful-config',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ContentfulConfigurationPage />
          </Suspense>
        )
      },
      {
        path: 'environment-variables',
        element: (
          <Suspense fallback={<PageLoading />}>
            <EnvironmentVariablesPage />
          </Suspense>
        )
      },
      {
        path: 'strapi-setup',
        element: (
          <Suspense fallback={<PageLoading />}>
            <StrapiSetupPage />
          </Suspense>
        )
      },
      ...adminRoutes
    ]
  }
];

export default routes;
