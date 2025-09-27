# New Language Addition Checklist

**Estimated time: ~20 minutes per language**

## Step 1: Configuration (2 minutes)

### Add Language to Core Configuration
Edit `src/contexts/LanguageContext.tsx`:

```typescript
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  // Add new language here:
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];
```

## Step 2: Critical Path Testing (10 minutes)

### **Test these paths in order:**

- [ ] **Switch language** using LanguageSelector
- [ ] **Homepage** - Hero sections, features, business goals preview
- [ ] **Translation disclaimer** appears at top in target language
- [ ] **Navigation** - All menu items translate
- [ ] **Product listing** - Product cards, filters, pagination
- [ ] **Product detail** - Full product information, features, benefits
- [ ] **Machine listing** - Machine cards, categories
- [ ] **Machine detail** - Technical specifications, features
- [ ] **Business goals** - Goal cards, details, benefits
- [ ] **Blog listing** - Post previews, pagination
- [ ] **Blog article** - Full content, navigation, metadata
- [ ] **Technology pages** - All technology content
- [ ] **Contact forms** - Labels, validation, success messages
- [ ] **Error pages** - 404, general errors
- [ ] **Footer** - Links, copyright, company info

## Step 3: SEO Verification (5 minutes)

### **Check these SEO elements:**
- [ ] **HTML lang attribute** updates to new language code
- [ ] **hreflang links** are generated for all languages
- [ ] **Meta descriptions** are appropriate for language
- [ ] **Open Graph locale** tags are correct

### **Quick SEO Test:**
1. View page source in browser
2. Check `<html lang="XX">` matches selected language
3. Verify `<link rel="alternate" hreflang="XX"` tags exist
4. Confirm `<meta property="og:locale"` is correct

## Step 4: Performance Check (3 minutes)

### **Verify these performance aspects:**
- [ ] **Translation caching** - Revisit pages to ensure translations load from cache
- [ ] **No excessive API calls** - Check network tab for translation requests
- [ ] **Fallback behavior** - Ensure untranslated content falls back to English gracefully
- [ ] **Loading states** - Confirm loading indicators appear for long translations

## Common Language Codes Reference

| Language | Code | Flag | Name |
|----------|------|------|------|
| French | `fr` | 🇫🇷 | Français |
| German | `de` | 🇩🇪 | Deutsch |
| Portuguese | `pt` | 🇵🇹 | Português |
| Italian | `it` | 🇮🇹 | Italiano |
| Dutch | `nl` | 🇳🇱 | Nederlands |
| Russian | `ru` | 🇷🇺 | Русский |
| Japanese | `ja` | 🇯🇵 | 日本語 |
| Korean | `ko` | 🇰🇷 | 한국어 |
| Chinese (Simplified) | `zh` | 🇨🇳 | 中文 |
| Arabic | `ar` | 🇸🇦 | العربية |

## Troubleshooting New Languages

### **If translations don't appear:**
1. Check browser console for errors
2. Verify language code is correct in SUPPORTED_LANGUAGES
3. Ensure translation service is running
4. Check network requests for translation API calls

### **If some content stays in English:**
1. Verify the content is wrapped in TranslatableText or using translation hooks
2. Check translation context is appropriate
3. Look for hardcoded English strings in components

### **If performance is slow:**
1. Check if batch translation is being used for lists
2. Verify React Query caching is working
3. Monitor translation API response times

## Success Criteria

✅ **Language successfully added when:**
- All UI elements translate appropriately
- Rich text content from Contentful translates
- Translation disclaimer appears in target language
- SEO meta tags update correctly
- Performance remains acceptable
- Fallbacks work gracefully for missing translations