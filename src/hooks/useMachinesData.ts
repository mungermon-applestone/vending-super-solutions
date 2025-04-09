
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cmsService from '@/services/cms';
import { CMSMachine } from '@/types/cms';
import { toast } from '@/components/ui/use-toast';

// Static machine data as fallback
const staticMachines = {
  'divi-wp': {
    id: '5',
    slug: 'divi-wp',
    title: "DIVI-WP",
    type: 'vending',
    temperature: "ambient",
    description: "Weather-protected vending system for outdoor installations.",
    images: [{ url: "https://images.unsplash.com/photo-1557034362-4ec717153f8f", alt: "DIVI-WP" }]
  },
  'divi-ws': {
    id: '6',
    slug: 'divi-ws',
    title: "DIVI-WS",
    type: 'vending',
    temperature: "ambient",
    description: "Wall-mounted slim profile vending machine for tight spaces.",
    images: [{ url: "https://images.unsplash.com/photo-1627395637580-988089c61818", alt: "DIVI-WS" }]
  },
  'divi-sp': {
    id: '7',
    slug: 'divi-sp',
    title: "DIVI-SP",
    type: 'vending',
    temperature: "ambient",
    description: "Space-saving profile vending machine with flexible configuration options.",
    images: [{ url: "https://images.unsplash.com/photo-1621964275191-ccc01ef2134c", alt: "DIVI-SP" }]
  },
  'combi-3000': {
    id: '8',
    slug: 'combi-3000',
    title: "Combi 3000",
    type: 'vending',
    temperature: "multi",
    description: "Combination vending system with multiple product categories.",
    images: [{ url: "https://images.unsplash.com/photo-1527256351016-8ad33ff833fc", alt: "Combi 3000" }]
  },
  '21-cell-temperature-controlled': {
    id: '10',
    slug: '21-cell-temperature-controlled',
    title: "21-cell temperature controlled locker",
    type: 'locker',
    temperature: "controlled",
    description: "Large capacity temperature-controlled locker system with 21 compartments.",
    images: [{ url: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f", alt: "21-cell Temperature Controlled Locker" }]
  }
};

/**
 * Hook to fetch all machines with optional filters
 */
export function useMachines(filters: Record<string, any> = {}) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['machines', filters],
    queryFn: async () => {
      console.log("[useMachines] Fetching machines with filters:", filters);
      try {
        const machines = await cmsService.getMachines(filters);
        console.log("[useMachines] Fetched machines:", machines);
        console.log(`[useMachines] Total machines fetched: ${machines.length}`);
        
        // Log each machine for debugging
        machines.forEach((machine, index) => {
          console.log(`[useMachines] Machine ${index + 1}:`, {
            id: machine.id,
            title: machine.title,
            type: machine.type,
            slug: machine.slug
          });
        });
        
        // Create a map of existing slugs for faster lookup
        const databaseMachineSlugs = new Set(machines.map(m => m.slug));
        
        // Add missing machines from static data
        const combinedMachines = [...machines];
        
        Object.entries(staticMachines).forEach(([slug, machineData]) => {
          if (!databaseMachineSlugs.has(slug)) {
            console.log(`[useMachines] Adding missing machine from static data: ${slug}`);
            combinedMachines.push(machineData as CMSMachine);
          }
        });
        
        console.log(`[useMachines] Total combined machines: ${combinedMachines.length}`);
        
        // Apply filters to combined machines if specified
        if (filters.featured === true) {
          const featuredMachines = combinedMachines.slice(0, filters.limit || 3);
          return featuredMachines;
        }
        
        if (filters.type) {
          return combinedMachines.filter(machine => machine.type === filters.type);
        }
        
        return combinedMachines;
      } catch (error) {
        console.error("[useMachines] Error fetching machines:", error);
        // If database fetch fails entirely, return static data
        console.log("[useMachines] Falling back to static machines data");
        
        let staticMachinesList = Object.values(staticMachines) as CMSMachine[];
        
        // Apply filters to static machines if specified
        if (filters.featured === true) {
          staticMachinesList = staticMachinesList.slice(0, filters.limit || 3);
        }
        
        if (filters.type) {
          staticMachinesList = staticMachinesList.filter(machine => machine.type === filters.type);
        }
        
        return staticMachinesList;
      }
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch a specific machine by its ID
 */
export function useMachineById(id: string | undefined) {
  return useQuery({
    queryKey: ['machine', id],
    queryFn: async () => {
      console.log("[useMachineById] Fetching machine with ID:", id);
      try {
        const machine = await cmsService.getMachineById(id || '');
        console.log("[useMachineById] Fetched machine:", machine);
        return machine;
      } catch (error) {
        console.error("[useMachineById] Error fetching machine by ID:", error);
        throw error;
      }
    },
    enabled: !!id && id.trim() !== '',
  });
}

/**
 * Hook to fetch a specific machine by type and slug
 */
export function useMachineBySlug(type: string | undefined, slug: string | undefined) {
  return useQuery({
    queryKey: ['machine', type, slug],
    queryFn: async () => {
      console.log("[useMachineBySlug] Fetching machine with type/slug:", type, slug);
      try {
        const machine = await cmsService.getMachineBySlug(type || '', slug || '');
        
        // If machine is found in database, return it
        if (machine) {
          console.log("[useMachineBySlug] Fetched machine from database:", machine);
          return machine;
        }
        
        // Otherwise check if we have it in static data
        if (slug && staticMachines[slug]) {
          console.log(`[useMachineBySlug] Machine not in database, using static data for: ${slug}`);
          return staticMachines[slug] as CMSMachine;
        }
        
        // If not found anywhere
        console.log(`[useMachineBySlug] Machine not found: ${type}/${slug}`);
        return null;
      } catch (error) {
        console.error("[useMachineBySlug] Error fetching machine by slug:", error);
        
        // On error, check if we have a static fallback
        if (slug && staticMachines[slug]) {
          console.log(`[useMachineBySlug] Error fetching from database, falling back to static data: ${slug}`);
          return staticMachines[slug] as CMSMachine;
        }
        
        throw error;
      }
    },
    enabled: !!type && !!slug,
  });
}

/**
 * Hook to create a new machine
 */
export function useCreateMachine() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (machineData: any) => cmsService.createNewMachine(machineData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      toast({
        title: "Machine created",
        description: "The machine was created successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Error creating machine:', error);
      toast({
        title: "Error",
        description: "Failed to create machine. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to update an existing machine
 */
export function useUpdateMachine() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, machineData }: { id: string, machineData: any }) => 
      cmsService.updateExistingMachine(id, machineData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machine', variables.id] });
      toast({
        title: "Machine updated",
        description: "The machine was updated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Error updating machine:', error);
      toast({
        title: "Error",
        description: "Failed to update machine. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to delete a machine
 */
export function useDeleteMachine() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => cmsService.removeExistingMachine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      toast({
        title: "Machine deleted",
        description: "The machine was deleted successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Error deleting machine:', error);
      toast({
        title: "Error",
        description: "Failed to delete machine. Please try again.",
        variant: "destructive",
      });
    },
  });
}
