
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const blogPostTemplate: ContentTypeTemplate = {
  id: 'blogPost',
  name: 'Blog Post',
  description: 'Create a blog post content type with rich text content',
  contentType: {
    id: 'blogPost',
    name: 'Blog Post',
    description: 'A blog post with rich text content',
    displayField: 'title',
    publish: true,
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        required: true,
        localized: false,
      },
      {
        id: 'slug',
        name: 'Slug',
        type: 'Symbol',
        required: true,
        localized: false,
        validations: [
          { unique: true },
          {
            regexp: {
              pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
              flags: '' // Ensuring flags is explicitly set
            },
            message: 'Slug must contain only lowercase letters, numbers, and hyphens'
          }
        ]
      },
      {
        id: 'publishDate',
        name: 'Publish Date',
        type: 'Date',
        required: false,
        localized: false,
      },
      {
        id: 'featuredImage',
        name: 'Featured Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        localized: false,
      },
      {
        id: 'content',
        name: 'Content',
        type: 'RichText',
        required: true,
        localized: false,
      },
      {
        id: 'excerpt',
        name: 'Excerpt',
        type: 'Text',
        required: false,
        localized: false,
      },
      {
        id: 'author',
        name: 'Author',
        type: 'Symbol',
        required: false,
        localized: false,
      },
      {
        id: 'tags',
        name: 'Tags',
        type: 'Array',
        items: {
          type: 'Symbol'
        },
        required: false,
        localized: false,
      }
    ]
  }
};
