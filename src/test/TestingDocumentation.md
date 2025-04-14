
# CMS Testing Strategy

## CMS Product Type Testing

### Unit Tests

#### Service Layer
- `getProductTypes()` ✅
- `getProductTypeBySlug()` ✅
- `createProduct()` ✅
- `updateProduct()` ✅
- `deleteProduct()` ✅
- `cloneProduct()` ✅

#### Component Tests
- AdminProducts page ✅
  - Loading state ✅
  - Successful product list rendering ✅
  - Empty state handling ✅
- ProductEditorForm ✅
  - Create mode rendering ✅
  - Edit mode rendering ✅
  - Form population with data ✅
- ProductTableRow ✅
  - Proper rendering ✅
  - Action buttons functionality ✅
- DeleteProductDialog ✅
  - Dialog visibility ✅
  - Delete confirmation ✅

### Integration Tests
- Verify end-to-end data flow from Supabase to UI
- Test slug matching and retrieval mechanisms
- Test product create, update, delete operations

### Manual Testing Checklist
- Create a new product ⬜
- Edit an existing product ⬜
- Clone an existing product ⬜
- Delete a product ⬜
- Verify product listing updates after operations ⬜
- Verify form validation works as expected ⬜

### Best Practices
- Use mocking for external dependencies
- Test various scenarios (success, loading, error)
- Maintain test isolation
- Favor component tests over snapshot tests for UI verification
