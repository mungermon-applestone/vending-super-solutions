import { ProductFormData } from '@/types/forms';
import { toast } from '@/components/ui/use-toast';
import { createProduct as createProductCMS } from '@/services/cms/product';

export const createProduct = async (data: ProductFormData, toastObj: { toast: typeof toast }) => {
  try {
    const { toast } = toastObj;
    await createProductCMS(data);
    toast({
      title: "Product created",
      description: `${data.title} has been created successfully.`
    });
  } catch (error) {
    console.error("Error creating product:", error);
    toast({
      title: "Error",
      description: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive"
    });
    throw error;
  }
};
