
# Form Troubleshooting Guide

## Uneditable Form Fields After Cloning

If form fields become uneditable after cloning an item, check the following:

### Root Causes

1. **Form Reset Issues**: When a form is reset with new data after cloning, the form fields may not be properly registered or initialized.

2. **Value Handling**: Fields without explicit value handling (e.g., `value={field.value || ''}`) can become uneditable.

3. **Form State Sync**: The form state may not be properly synced with the UI after cloning operations.

### Solutions

1. **Explicit Value Handling** for all form fields:
   ```tsx
   <Input
     {...field}
     value={field.value || ''}
     onChange={(e) => {
       console.log('Field changed:', e.target.value);
       field.onChange(e);
     }}
   />
   ```

2. **Force Form Reset** when product data changes:
   ```tsx
   useEffect(() => {
     if (productSlug) {
       form.reset(defaultValues);
       setFormInitialized(false);
     }
   }, [productSlug]);
   ```

3. **Flag Initialization Status** to prevent multiple initializations:
   ```tsx
   const [formInitialized, setFormInitialized] = useState(false);
   
   // In the effect that sets form data
   if (existingProduct && !isCreating && !formInitialized) {
     form.reset(productData);
     setFormInitialized(true);
   }
   ```

4. **Use a Key** on your form component to force re-mounting:
   ```tsx
   <Form key={`${productSlug || 'new'}-${forceUpdate}`} {...form}>
     {/* form content */}
   </Form>
   ```

## Best Practices

1. **Componentize Form Fields**: Create reusable form field components with consistent handling.

2. **Debug Form State**: Add logging for form values and field changes.

3. **Always Use Controlled Inputs**: Ensure all form inputs are properly controlled.

4. **Handle Undefined Values**: Always provide fallbacks for potentially undefined form values.

5. **Reset Form Completely**: Use `form.reset(newValues)` rather than setting field values individually.

## Content Deletion Issues

If content deletion doesn't work properly, check the following:

### Root Causes

1. **Orphaned Related Records**: If related records aren't deleted first, database constraints may prevent deletion.

2. **Incorrect ID/Slug Usage**: Using slug in place of ID or vice versa in deletion queries.

3. **Missing Error Handling**: Deletion errors that are silently caught without propagation.

### Solutions

1. **Delete Related Records First**:
   ```tsx
   // Delete related records first
   await supabase.from('related_table').delete().eq('parent_id', id);
   
   // Then delete the main record
   await supabase.from('main_table').delete().eq('id', id);
   ```

2. **Verify ID Resolution**:
   ```tsx
   // First fetch the entity to ensure we have the correct ID
   const { data, error } = await supabase
     .from('table')
     .select('id')
     .eq('slug', slug)
     .single();
     
   // Then use the ID for deletion
   await supabase.from('table').delete().eq('id', data.id);
   ```

3. **Proper Error Propagation**:
   ```tsx
   if (error) {
     console.error('Deletion error:', error);
     throw error; // Don't silently catch errors
   }
   ```

## Implementation Examples

See the following files for examples of proper form field handling:

- `src/components/admin/product-editor/sections/BasicInformation.tsx`
- `src/components/admin/product-editor/sections/ProductImage.tsx`
- `src/hooks/useProductEditorForm.ts`
- `src/components/admin/product-editor/FormFieldWrapper.tsx`

## When to Use FormFieldWrapper

The `FormFieldWrapper` component standardizes form field handling. Use it when:

1. Creating new form fields that need consistent handling
2. Refactoring existing form fields for better maintainability
3. Working with forms that may be affected by operations like cloning

Example usage:

```tsx
<FormFieldWrapper
  form={form}
  name="title"
  label="Title"
  placeholder="Enter title"
  renderInput={(field) => (
    <Input
      {...field}
      placeholder="Product Title"
      value={field.value || ''}
    />
  )}
/>
```
