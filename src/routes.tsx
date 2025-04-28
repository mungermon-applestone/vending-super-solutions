
import React from 'react';
import { RouteObject } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import ProductsPage from '@/pages/ProductsPage';
import ProductsLanding from '@/pages/ProductsLanding';
import ProductDetailPage from '@/pages/ProductDetailPage';
import MachinesPage from '@/pages/MachinesPage';
import MachineDetailPage from '@/pages/MachineDetailPage';
import TechnologyPage from '@/pages/TechnologyPage';
import BlogPage from '@/pages/blog/BlogPage';
import BlogPostDetail from '@/pages/blog/BlogPostDetail';
import ServicesPage from '@/pages/ServicesPage';
import ErrorPage from '@/components/ErrorPage';
import GoalDetailPage from '@/pages/GoalDetailPage';
import AdminPage from '@/pages/AdminPage';
import ContentfulConfigurationPage from '@/pages/ContentfulConfigurationPage';

// Define the routes for the application
const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/about',
    element: <AboutPage />
  },
  {
    path: '/contact',
    element: <ContactPage />
  },
  {
    path: '/products-landing',
    element: <ProductsLanding />
  },
  {
    path: '/products',
    element: <ProductsPage />
  },
  {
    path: '/products/:slug',
    element: <ProductDetailPage />
  },
  {
    path: '/machines',
    element: <MachinesPage />
  },
  {
    path: '/machines/:slug',
    element: <MachineDetailPage />
  },
  {
    path: '/technology',
    element: <TechnologyPage />
  },
  {
    path: '/goals/:slug',
    element: <GoalDetailPage />
  },
  {
    path: '/services',
    element: <ServicesPage />
  },
  {
    path: '/blog',
    element: <BlogPage />
  },
  {
    path: '/blog/:slug',
    element: <BlogPostDetail />
  },
  {
    path: '/admin',
    element: <AdminPage />
  },
  {
    path: '/admin/contentful-config',
    element: <ContentfulConfigurationPage />
  }
];

export default routes;
