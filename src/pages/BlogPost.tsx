
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Calendar, User, Share2, Bookmark, MessageSquare } from 'lucide-react';

// Sample blog data (in a real application, this would come from an API or CMS)
const blogPosts = [
  {
    id: 1,
    title: "The Future of Vending Technology in 2025",
    excerpt: "Explore the latest trends and innovations shaping the vending industry in 2025 and beyond.",
    content: `
      <p>The vending industry is undergoing a dramatic transformation, driven by technological advancements and changing consumer expectations. As we look toward 2025, several key trends are emerging that will define the future of vending technology.</p>
      
      <h2>1. IoT-Connected Machines</h2>
      <p>Internet of Things (IoT) connectivity is becoming standard in modern vending machines. These connected devices can report real-time inventory levels, maintenance needs, and sales data. By 2025, we expect to see advanced predictive analytics that can forecast inventory needs and optimize restocking routes.</p>
      
      <h2>2. Contactless Interactions</h2>
      <p>The demand for contactless experiences has accelerated, and vending machines are at the forefront of this trend. Beyond contactless payments, we're seeing the implementation of gesture control and voice command technologies that allow customers to make selections without touching any surfaces.</p>
      
      <h2>3. AI-Powered Personalization</h2>
      <p>Artificial intelligence is enabling vending machines to offer personalized experiences. Machines equipped with cameras and AI can recognize returning customers and make product recommendations based on previous purchases or current weather conditions.</p>
      
      <h2>4. Sustainable Solutions</h2>
      <p>Sustainability is increasingly important to consumers and businesses alike. Vending machine manufacturers are responding with energy-efficient designs, eco-friendly refrigeration systems, and machines that can dispense products with minimal packaging or into reusable containers.</p>
      
      <h2>5. Expanded Product Categories</h2>
      <p>The range of products available through vending machines is expanding rapidly. From fresh prepared meals to electronics and personal care items, vending machines are becoming automated retail solutions rather than simple snack dispensers.</p>
      
      <h2>The Bottom Line</h2>
      <p>As we approach 2025, the vending industry is embracing technology to create more efficient, engaging, and profitable solutions. Businesses that adapt to these trends will be well-positioned to meet evolving consumer expectations and stay competitive in this rapidly changing landscape.</p>
    `,
    date: "April 2, 2025",
    category: "Industry Trends",
    author: "Jane Smith",
    authorTitle: "Industry Analyst",
    authorImage: "/placeholder.svg",
    image: "/placeholder.svg",
    slug: "future-vending-technology-2025",
    relatedPosts: [2, 3, 5]
  },
  {
    id: 2,
    title: "How AI is Transforming Inventory Management for Vending Machines",
    excerpt: "Discover how artificial intelligence is revolutionizing inventory management for vending machine operators.",
    content: `<p>Sample content for AI article...</p>`,
    date: "March 28, 2025",
    category: "Technology",
    author: "Michael Johnson",
    authorTitle: "Technology Director",
    authorImage: "/placeholder.svg",
    image: "/placeholder.svg",
    slug: "ai-transforming-inventory-management",
    relatedPosts: [1, 4, 5]
  },
  {
    id: 3,
    title: "Sustainable Vending: Eco-Friendly Solutions for Modern Businesses",
    excerpt: "Learn how vending operators are adopting sustainable practices and reducing their environmental footprint.",
    content: `<p>Sample content for sustainability article...</p>`,
    date: "March 15, 2025",
    category: "Sustainability",
    author: "Sarah Williams",
    authorTitle: "Sustainability Consultant",
    authorImage: "/placeholder.svg",
    image: "/placeholder.svg",
    slug: "sustainable-vending-eco-friendly-solutions",
    relatedPosts: [1, 6]
  },
  {
    id: 4,
    title: "Cashless Payment Systems: Boosting Sales and Customer Satisfaction",
    excerpt: "Explore how cashless payment options are increasing revenue and enhancing the customer experience.",
    content: `<p>Sample content for payments article...</p>`,
    date: "March 5, 2025",
    category: "Payments",
    author: "David Chen",
    authorTitle: "Payments Specialist",
    authorImage: "/placeholder.svg",
    image: "/placeholder.svg",
    slug: "cashless-payment-systems-sales-satisfaction",
    relatedPosts: [1, 2]
  },
  {
    id: 5,
    title: "Vending Machine Data Analytics: Turning Insights into Action",
    excerpt: "How to leverage data analytics to optimize your vending machine business and drive growth.",
    content: `<p>Sample content for data analytics article...</p>`,
    date: "February 20, 2025",
    category: "Data & Analytics",
    author: "Lisa Anderson",
    authorTitle: "Data Scientist",
    authorImage: "/placeholder.svg",
    image: "/placeholder.svg",
    slug: "vending-machine-data-analytics",
    relatedPosts: [1, 2]
  },
  {
    id: 6,
    title: "The Rise of Fresh Food Vending: Meeting Consumer Demand for Healthy Options",
    excerpt: "Why fresh food vending machines are gaining popularity and how to capitalize on this growing trend.",
    content: `<p>Sample content for fresh food article...</p>`,
    date: "February 10, 2025",
    category: "Fresh Food",
    author: "Robert Taylor",
    authorTitle: "Food Industry Expert",
    authorImage: "/placeholder.svg",
    image: "/placeholder.svg",
    slug: "rise-fresh-food-vending-healthy-options",
    relatedPosts: [3]
  }
];

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Find the current post by slug
  const post = blogPosts.find(post => post.slug === slug);
  
  // Handle case where post is not found
  if (!post) {
    return (
      <Layout>
        <div className="container-wide py-12">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <p className="mb-6">The blog post you're looking for does not exist.</p>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Get related posts
  const relatedPosts = blogPosts.filter(relatedPost => 
    post.relatedPosts.includes(relatedPost.id)
  ).slice(0, 3);

  return (
    <Layout>
      <div className="container-wide py-12">
        {/* Back to blog link */}
        <Link to="/blog" className="flex items-center gap-1 text-vending-blue hover:underline mb-6">
          <ChevronLeft size={18} />
          <span>Back to all articles</span>
        </Link>
        
        {/* Article header */}
        <div className="mb-8">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vending-blue mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
          </div>
        </div>
        
        {/* Featured image */}
        <div className="mb-10">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto rounded-lg shadow-md"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
        
        {/* Article content */}
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Social sharing */}
            <div className="border-t border-b border-gray-200 py-6 my-8">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <span>Share this article:</span>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 size={16} />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Bookmark size={16} />
                    <span>Save</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>Comment</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Author bio */}
            <div className="bg-gray-50 rounded-lg p-6 mb-10">
              <div className="flex items-center gap-4">
                <img
                  src={post.authorImage}
                  alt={post.author}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-bold text-lg">{post.author}</h3>
                  <p className="text-gray-600">{post.authorTitle}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Related posts */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Related Articles</h3>
              <div className="flex flex-col gap-4">
                {relatedPosts.map(relatedPost => (
                  <Link to={`/blog/${relatedPost.slug}`} key={relatedPost.id}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2">{relatedPost.category}</Badge>
                        <h4 className="font-bold mb-1 hover:text-vending-blue transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-600">{relatedPost.date}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Newsletter signup */}
            <Card className="bg-vending-blue text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">Subscribe to Our Newsletter</h3>
                <p className="mb-4">Stay updated with the latest industry insights and news.</p>
                <form className="flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-3 py-2 rounded text-gray-800 w-full"
                  />
                  <Button variant="secondary">Subscribe</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
