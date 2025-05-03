
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import AdminPage from '@/pages/AdminPage';
import ContentfulConfigurationPage from '@/pages/ContentfulConfigurationPage';
import EnvironmentVariablesPage from '@/pages/admin/EnvironmentVariablesPage';
import AdminLayout from '@/components/AdminLayout';
import { adminRoutes } from '@/router/adminRoutes';
import RootLayout from '@/components/RootLayout';
import Index from '@/pages/Index';
import Products from '@/pages/Products';
import ProductDetailPage from '@/pages/ProductDetailPage';
import MachinesPage from '@/pages/MachinesPage';
import MachineDetailPage from '@/pages/MachineDetailPage';
import BusinessGoalsPage from '@/pages/BusinessGoalsPage';
import BusinessGoalDetailPage from '@/pages/BusinessGoalDetailPage';
import BusinessGoalDetail from '@/pages/BusinessGoalDetail'; // Old implementation
import NotFound from '@/pages/NotFound';
import TechnologyPage from '@/pages/TechnologyPage';
import About from '@/pages/About';
import BlogPage from '@/pages/BlogPage';
import ContentfulBlogPostDetail from '@/pages/ContentfulBlogPostDetail';
import Contact from '@/pages/Contact';
import StrapiSetupPage from '@/pages/admin/StrapiSetupPage';
import ZhilaiApplestoneAnnouncement from '@/pages/ZhilaiApplestoneAnnouncement';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'products',
        element: <Products />
      },
      {
        path: 'products/:slug',
        element: <ProductDetailPage />
      },
      {
        path: 'machines',
        element: <MachinesPage />
      },
      {
        path: 'machines/:slug',
        element: <MachineDetailPage />
      },
      {
        path: 'machines/:machineType/:machineId',
        element: <MachineDetailPage />
      },
      {
        path: 'technology',
        element: <TechnologyPage />
      },
      {
        path: 'business-goals',
        element: <BusinessGoalsPage />
      },
      {
        path: 'business-goals/:slug',
        element: <BusinessGoalDetailPage />
      },
      {
        path: 'goals/:slug',
        element: <BusinessGoalDetail />
      },
      {
        path: 'business/:slug',
        element: <BusinessGoalDetailPage />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'blog',
        element: <BlogPage />
      },
      {
        path: 'blog/:slug',
        element: <ContentfulBlogPostDetail />
      },
      {
        path: 'blog/zhilai-applestone-announcement',
        element: <ZhilaiApplestoneAnnouncement />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />
      },
      {
        path: 'contentful-config',
        element: <ContentfulConfigurationPage />
      },
      {
        path: 'environment-variables',
        element: <EnvironmentVariablesPage />
      },
      {
        path: 'strapi-setup',
        element: <StrapiSetupPage />
      },
      ...adminRoutes
    ]
  }
];

export default routes;
