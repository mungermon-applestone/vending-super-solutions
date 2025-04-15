
import { ContentTypeTemplate, AVAILABLE_ICONS } from '@/types/contentful-admin';

export const contentTypeTemplates: Record<string, ContentTypeTemplate> = {
  blogPost: {
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
                flags: ''
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
  },
  productType: {
    id: 'productType',
    name: 'Product Type',
    description: 'Create a product type for vending machines',
    contentType: {
      id: 'productType',
      name: 'Product Type',
      description: 'A vending machine product type',
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
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: true,
          localized: false,
        },
        {
          id: 'image',
          name: 'Main Image',
          type: 'Link',
          linkType: 'Asset',
          required: false,
          localized: false,
        },
        {
          id: 'benefits',
          name: 'Benefits',
          type: 'Array',
          items: {
            type: 'Symbol',
          },
          required: false,
          localized: false,
        },
        {
          id: 'features',
          name: 'Features',
          type: 'Array',
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['feature']
              }
            ]
          },
          required: false,
          localized: false,
        },
        {
          id: 'visible',
          name: 'Visible',
          type: 'Boolean',
          required: false,
          localized: false,
        }
      ]
    }
  },
  feature: {
    id: 'feature',
    name: 'Feature',
    description: 'Create a feature that can be used in products or business goals',
    contentType: {
      id: 'feature',
      name: 'Feature',
      description: 'A feature for products or business goals',
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
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: true,
          localized: false,
        },
        {
          id: 'icon',
          name: 'Icon',
          type: 'Symbol',
          required: false,
          localized: false,
          validations: [
            {
              in: AVAILABLE_ICONS.map(icon => icon.value),
              message: 'Please select a valid icon'
            }
          ]
        },
        {
          id: 'screenshot',
          name: 'Screenshot',
          type: 'Link',
          linkType: 'Asset',
          required: false,
          localized: false,
        }
      ]
    }
  },
  businessGoal: {
    id: 'businessGoal',
    name: 'Business Goal',
    description: 'Create a business goal content type',
    contentType: {
      id: 'businessGoal',
      name: 'Business Goal',
      description: 'A business goal',
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
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: true,
          localized: false,
        },
        {
          id: 'image',
          name: 'Image',
          type: 'Link',
          linkType: 'Asset',
          required: false,
          localized: false,
        },
        {
          id: 'icon',
          name: 'Icon',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'benefits',
          name: 'Benefits',
          type: 'Array',
          items: {
            type: 'Symbol',
          },
          required: false,
          localized: false,
        },
        {
          id: 'features',
          name: 'Features',
          type: 'Array',
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: ['feature']
              }
            ]
          },
          required: false,
          localized: false,
        },
        {
          id: 'visible',
          name: 'Visible',
          type: 'Boolean',
          required: false,
          localized: false,
        }
      ]
    }
  },
  machine: {
    id: 'machine',
    name: 'Machine',
    description: 'Create a vending or locker machine content type',
    contentType: {
      id: 'machine',
      name: 'Machine',
      description: 'A vending or locker machine with specifications',
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
          id: 'type',
          name: 'Type',
          type: 'Symbol',
          required: true,
          localized: false,
          validations: [
            {
              in: ['vending', 'locker'],
              message: 'Type must be either vending or locker'
            }
          ]
        },
        {
          id: 'temperature',
          name: 'Temperature',
          type: 'Symbol',
          required: false,
          localized: false,
          validations: [
            {
              in: ['ambient', 'refrigerated', 'frozen', 'multi', 'controlled'],
              message: 'Invalid temperature type'
            }
          ]
        },
        {
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: true,
          localized: false,
        },
        {
          id: 'features',
          name: 'Features',
          type: 'Array',
          items: {
            type: 'Symbol'
          },
          required: false,
          localized: false,
        },
        {
          id: 'images',
          name: 'Images',
          type: 'Array',
          items: {
            type: 'Link',
            linkType: 'Asset',
            validations: [
              {
                linkMimetypeGroup: ['image']
              }
            ]
          },
          required: false,
          localized: false,
        },
        {
          id: 'dimensions',
          name: 'Dimensions',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'weight',
          name: 'Weight',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'powerRequirements',
          name: 'Power Requirements',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'capacity',
          name: 'Capacity',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'paymentOptions',
          name: 'Payment Options',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'connectivity',
          name: 'Connectivity',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'manufacturer',
          name: 'Manufacturer',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'warranty',
          name: 'Warranty',
          type: 'Symbol',
          required: false,
          localized: false,
        },
        {
          id: 'visible',
          name: 'Visible',
          type: 'Boolean',
          required: false,
          localized: false,
        }
      ]
    }
  }
};
