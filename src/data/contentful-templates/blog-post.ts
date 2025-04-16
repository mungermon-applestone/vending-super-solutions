
import { ContentTypeTemplate } from '@/types/contentful-admin';

export const blogPostTemplate: ContentTypeTemplate = {
  id: 'blogPost',
  name: 'Blog Post',
  description: 'Content type for blog posts',
  contentType: {
    id: 'blogPost',
    name: 'Blog Post',
    description: 'A blog post',
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
          { unique: true }
        ]
      },
      {
        id: 'excerpt',
        name: 'Excerpt',
        type: 'Text',
        required: true,
        localized: false,
      },
      {
        id: 'content',
        name: 'Content',
        type: 'Text',
        required: true,
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
        id: 'publishDate',
        name: 'Publish Date',
        type: 'Date',
        required: true,
        localized: false,
      },
      {
        id: 'author',
        name: 'Author',
        type: 'Symbol',
        required: false,
        localized: false,
      }
    ]
  }
};
