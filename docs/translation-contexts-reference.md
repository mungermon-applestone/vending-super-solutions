# Translation Contexts Reference

This document lists all 47 translation contexts used throughout the application, organized by category.

## Static UI Contexts

### Core Navigation & Interface
- **`navigation`** - Main menu items, navigation links
- **`forms`** - Form labels, buttons, validation messages
- **`ui-states`** - Loading, success, error, no results messages
- **`auth`** - Authentication flows, login/logout messages
- **`error-page`** - Error page content and messages
- **`translation-disclaimer`** - Language translation notice bar

## Content Management System (CMS) Contexts

### Blog Content
- **`blog-listing`** - Blog post previews and listing pages
- **`blog-article`** - Individual blog post content
- **`blog-article-title`** - Blog post titles and headlines
- **`blog-article-meta`** - Publication dates, author info, status
- **`blog-article-nav`** - Previous/next post navigation
- **`blog-preview`** - Rich text content previews

### Business Goals
- **`business-goals`** - Business goals main content
- **`business-goal`** - Individual business goal details
- **`business-goal-features`** - Goal feature descriptions
- **`business-goal-video`** - Video section content and captions
- **`business-goals-page`** - Business goals page-specific content

### Machines
- **`machines`** - Machine listings and general content
- **`machine`** - Individual machine details and specifications
- **`machines-hero`** - Machines page hero section
- **`machines-intro`** - Machines introduction and overview
- **`machines-page`** - Machines page-specific content

### Products
- **`products`** - Product listings and general content
- **`product`** - Individual product details and features
- **`products-hero`** - Products page hero section
- **`products-page`** - Products page-specific content

### Technology
- **`technology`** - Technology content and descriptions
- **`technology-sections`** - Technology detail sections

### Testimonials
- **`testimonials-section`** - Testimonials carousel and section
- **`testimonial`** - Individual customer testimonials

## Page-Specific Contexts

### Homepage
- **`home-features`** - Homepage feature sections
- **`home-hero`** - Homepage hero content
- **`home-testimonials`** - Homepage testimonial section

### Contact & Support
- **`contact`** - Contact page forms and information
- **`contact-form`** - Contact form specific content

### CMS Content Areas
- **`cms`** - Generic CMS content (fallback context)
- **`hero-slide`** - Hero slider/carousel content
- **`features`** - Generic feature list content

## Technical Contexts

### Rich Text & Documents
- **`rich-text`** - Contentful rich text content
- **`document`** - Document-specific content

### Metadata & SEO
- **`seo`** - SEO-specific content and meta descriptions
- **`meta`** - Page metadata and descriptions

## Usage Guidelines

### **Choosing the Right Context**

1. **Be Specific**: Use the most specific context available
   - ✅ Use `blog-article-title` for blog post titles
   - ❌ Don't use generic `blog` for specific elements

2. **Group Related Content**: Keep related translations in the same context
   - ✅ All product features use `product` context
   - ✅ All form elements use `forms` context

3. **Maintain Consistency**: Use the same context across similar components
   - ✅ All error messages use `error-page` or `ui-states`
   - ✅ All navigation items use `navigation`

### **Context Naming Convention**

- **Singular vs Plural**: 
  - Use plural for listings: `products`, `machines`
  - Use singular for individual items: `product`, `machine`

- **Hierarchical Structure**:
  - Page-level: `machines-page`, `products-page`
  - Section-level: `machines-hero`, `products-hero`
  - Component-level: `machine`, `product`

### **Adding New Contexts**

When adding new contexts:
1. Check if existing context covers the use case
2. Follow naming convention patterns
3. Document the new context in this reference
4. Update translation system documentation

### **Context Performance**

- **Batch Similar Contexts**: Group related content for batch translation
- **Cache Effectively**: Similar contexts benefit from shared caching
- **Minimize Context Switching**: Keep related content in same context when possible

## Translation Hook Usage by Context

### **Individual Text Translation**
```typescript
const { translated } = useTranslation(text, { context: 'navigation' });
```

### **CMS Content Translation**
```typescript
const { translatedContent } = useTranslatedCMSContent(content, 'product');
```

### **Batch Translation**
```typescript
const { translations } = useBatchTranslation(texts, 'blog-listing');
```

### **Rich Text Translation**
```typescript
<TranslatedRichText document={content} context="blog-article" />
```

## Context Coverage Matrix

| Content Type | Primary Context | Secondary Contexts | Coverage |
|--------------|----------------|-------------------|----------|
| Navigation | `navigation` | - | ✅ Complete |
| Forms | `forms` | `ui-states` | ✅ Complete |
| Blog | `blog-article` | `blog-listing`, `blog-article-meta` | ✅ Complete |
| Products | `product` | `products-page`, `products-hero` | ✅ Complete |
| Machines | `machine` | `machines-page`, `machines-hero` | ✅ Complete |
| Business Goals | `business-goal` | `business-goals-page` | ✅ Complete |
| Technology | `technology` | `technology-sections` | ✅ Complete |
| Testimonials | `testimonial` | `testimonials-section` | ✅ Complete |
| Errors | `error-page` | `ui-states` | ✅ Complete |
| Authentication | `auth` | `forms` | ✅ Complete |

This comprehensive context system ensures consistent, efficient, and maintainable translations across all application content.