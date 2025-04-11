
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

## Standardized Deletion Pattern

For consistent deletion functionality across the application, follow this pattern:

### 1. Create a Delete Dialog Component

```tsx
// DeleteEntityDialog.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteEntityDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  entityToDelete: { id: string; title: string; slug: string } | null;
  onConfirmDelete: () => Promise<void>;
  isDeleting: boolean;
  entityType?: string; // Optional - entity type name for customized messages
}

const DeleteEntityDialog: React.FC<DeleteEntityDialogProps> = ({
  isOpen,
  setIsOpen,
  entityToDelete,
  onConfirmDelete,
  isDeleting,
  entityType = 'item'
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the {entityType} "{entityToDelete?.title}". 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmDelete} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
```

### 2. Create a Delete Function in the Service Layer

```tsx
// deleteEntity.ts
export const deleteEntity = async (slug: string): Promise<boolean> => {
  try {
    // 1. Fetch entity ID first
    const { data: entity, error: fetchError } = await supabase
      .from('entities')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (fetchError || !entity) {
      throw new Error(`Entity with slug '${slug}' not found`);
    }
    
    // 2. Delete related records first
    await Promise.all([
      supabase.from('entity_related_items').delete().eq('entity_id', entity.id),
      supabase.from('entity_images').delete().eq('entity_id', entity.id)
    ]);
    
    // 3. Delete the main entity
    const { error } = await supabase
      .from('entities')
      .delete()
      .eq('id', entity.id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Deletion error:', error);
    throw error; // Re-throw for proper handling in the component
  }
};
```

### 3. Implement in Admin Page

```tsx
// AdminEntitiesPage.tsx
const [isDeleting, setIsDeleting] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [entityToDelete, setEntityToDelete] = useState<{ id: string; title: string; slug: string } | null>(null);

const handleDeleteClick = (entity) => {
  setEntityToDelete({
    id: entity.id,
    title: entity.title,
    slug: entity.slug
  });
  setDeleteDialogOpen(true);
};

const confirmDelete = async () => {
  if (!entityToDelete) return;
  
  try {
    setIsDeleting(true);
    
    await deleteEntity(entityToDelete.slug);
    
    toast({
      title: "Entity deleted",
      description: `${entityToDelete.title} has been deleted successfully.`
    });
    
    queryClient.invalidateQueries({ queryKey: ['entities'] });
    
    setDeleteDialogOpen(false);
    setEntityToDelete(null);
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to delete entity",
      variant: "destructive",
    });
  } finally {
    setIsDeleting(false);
  }
};

// In the render function:
<DeleteEntityDialog
  isOpen={deleteDialogOpen}
  setIsOpen={setDeleteDialogOpen}
  entityToDelete={entityToDelete}
  onConfirmDelete={confirmDelete}
  isDeleting={isDeleting}
  entityType="entity"
/>
```

## Implementation Examples

See the following files for examples of proper deletion handling:

- `src/components/admin/product-editor/DeleteProductDialog.tsx`
- `src/components/admin/technology/DeleteTechnologyDialog.tsx`
- `src/services/cms/contentTypes/productTypes/deleteProductType.ts`
- `src/services/cms/contentTypes/technologies/deleteTechnology.ts`
- `src/pages/admin/AdminProducts.tsx`
- `src/pages/admin/AdminTechnology.tsx`
