
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Package, Goal, Database, Plus, Server, Layers, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const contentTypes = [
  {
    title: "Products",
    description: "Manage product types displayed on the site",
    icon: <Package className="h-8 w-8 text-blue-500" />,
    path: "/admin/products",
    createPath: "/admin/products/new",
    color: "bg-blue-50 border-blue-200"
  },
  {
    title: "Business Goals",
    description: "Manage business goals and solutions",
    icon: <Goal className="h-8 w-8 text-purple-500" />,
    path: "/admin/business-goals",
    createPath: "/admin/business-goals/new",
    color: "bg-purple-50 border-purple-200"
  },
  {
    title: "Machines",
    description: "Manage vending machines and lockers",
    icon: <Server className="h-8 w-8 text-emerald-500" />,
    path: "/admin/machines",
    createPath: "/admin/machines/new",
    color: "bg-emerald-50 border-emerald-200"
  },
  {
    title: "Technology",
    description: "Manage technology platform features",
    icon: <Monitor className="h-8 w-8 text-indigo-500" />,
    path: "/admin/technology",
    createPath: "/admin/technology/new",
    color: "bg-indigo-50 border-indigo-200"
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const AdminDashboard = () => {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "Admin Dashboard",
      description: "Welcome to the CMS admin dashboard",
    });
  }, [toast]);

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">CMS Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage all content types from a single interface
          </p>
        </div>

        <div className="mb-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">Quick Navigation</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {contentTypes.map((type) => (
                      <ListItem key={type.title} title={type.title} href={type.path}>
                        {type.description}
                      </ListItem>
                    ))}
                    <ListItem
                      title="Database Overview"
                      href="#database-section"
                    >
                      View and manage all database-driven content
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {contentTypes.map((type) => (
            <Card key={type.title} className={`shadow-sm border ${type.color}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-white shadow-sm border">
                    {type.icon}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={type.createPath} className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> New
                    </Link>
                  </Button>
                </div>
                <CardTitle className="mt-4">{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create, edit, and manage {type.title.toLowerCase()} content types.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={type.path}>Manage {type.title}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div id="database-section" className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-gray-700" />
            <h2 className="text-2xl font-bold">Database Content Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-500" />
                  Content Management
                </CardTitle>
                <CardDescription>
                  Access all content type management interfaces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {contentTypes.map((type) => (
                    <li key={type.title} className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-2">
                        {type.icon}
                        <span>{type.title}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={type.path}>Manage</Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link to={type.createPath}>Create</Link>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Commonly used admin actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" asChild className="h-auto py-4 flex flex-col">
                    <Link to="/admin/products/new">
                      <Package className="h-6 w-6 mb-1" />
                      <span>New Product</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto py-4 flex flex-col">
                    <Link to="/admin/business-goals/new">
                      <Goal className="h-6 w-6 mb-1" />
                      <span>New Goal</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto py-4 flex flex-col">
                    <Link to="/admin/machines/new">
                      <Server className="h-6 w-6 mb-1" />
                      <span>New Machine</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="h-auto py-4 flex flex-col">
                    <Link to="/admin/machines/migrate">
                      <Database className="h-6 w-6 mb-1" />
                      <span>Import Data</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
