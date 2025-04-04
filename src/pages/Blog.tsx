
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "The Future of Vending Technology in 2025",
    excerpt: "Explore the latest trends and innovations shaping the vending industry in 2025 and beyond.",
    date: "April 2, 2025",
    category: "Industry Trends",
    author: "Jane Smith",
    image: "/placeholder.svg",
    slug: "future-vending-technology-2025",
  },
  {
    id: 2,
    title: "How AI is Transforming Inventory Management for Vending Machines",
    excerpt: "Discover how artificial intelligence is revolutionizing inventory management for vending machine operators.",
    date: "March 28, 2025",
    category: "Technology",
    author: "Michael Johnson",
    image: "/placeholder.svg",
    slug: "ai-transforming-inventory-management",
  },
  {
    id: 3,
    title: "Sustainable Vending: Eco-Friendly Solutions for Modern Businesses",
    excerpt: "Learn how vending operators are adopting sustainable practices and reducing their environmental footprint.",
    date: "March 15, 2025",
    category: "Sustainability",
    author: "Sarah Williams",
    image: "/placeholder.svg",
    slug: "sustainable-vending-eco-friendly-solutions",
  },
  {
    id: 4,
    title: "Cashless Payment Systems: Boosting Sales and Customer Satisfaction",
    excerpt: "Explore how cashless payment options are increasing revenue and enhancing the customer experience.",
    date: "March 5, 2025",
    category: "Payments",
    author: "David Chen",
    image: "/placeholder.svg",
    slug: "cashless-payment-systems-sales-satisfaction",
  },
  {
    id: 5,
    title: "Vending Machine Data Analytics: Turning Insights into Action",
    excerpt: "How to leverage data analytics to optimize your vending machine business and drive growth.",
    date: "February 20, 2025",
    category: "Data & Analytics",
    author: "Lisa Anderson",
    image: "/placeholder.svg",
    slug: "vending-machine-data-analytics",
  },
  {
    id: 6,
    title: "The Rise of Fresh Food Vending: Meeting Consumer Demand for Healthy Options",
    excerpt: "Why fresh food vending machines are gaining popularity and how to capitalize on this growing trend.",
    date: "February 10, 2025",
    category: "Fresh Food",
    author: "Robert Taylor",
    image: "/placeholder.svg",
    slug: "rise-fresh-food-vending-healthy-options",
  },
];

// All unique categories from the blog posts
const allCategories = ["All", ...new Set(blogPosts.map(post => post.category))];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter blog posts based on search term and selected category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container-wide py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-vending-blue mb-6">
          Blog & Industry Insights
        </h1>
        <p className="text-xl text-gray-700 mb-10 max-w-3xl">
          Stay updated with the latest news, trends, and insights from the vending industry and our technology experts.
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search articles..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "" : "hover:bg-gray-100"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map(post => (
            <Link to={`/blog/${post.slug}`} key={post.id} className="group">
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge>{post.category}</Badge>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-vending-blue transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 mb-3">
                    {post.excerpt}
                  </p>
                  <p className="text-sm text-gray-500">By {post.author}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gray-100 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-700">
                Get the latest vending industry news and product updates delivered straight to your inbox.
              </p>
            </div>
            <div className="md:w-1/3 flex gap-2">
              <Input type="email" placeholder="Your email address" className="flex-grow" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
