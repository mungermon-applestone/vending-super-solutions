
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CMSTechnology } from "@/types/cms";

interface TechnologyGridProps {
  technologies: CMSTechnology[];
  isLoading?: boolean;
  error?: Error | null;
}

const TechnologyGrid: React.FC<TechnologyGridProps> = ({ technologies, isLoading, error }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-md animate-pulse">
            <CardHeader className="bg-gray-200 h-40"></CardHeader>
            <CardContent className="pt-4">
              <div className="h-7 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="h-16 bg-gray-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 rounded-md text-red-800">
        <h3 className="text-lg font-medium mb-2">Error loading technologies</h3>
        <p>{error.message}</p>
        <p className="mt-4">Please try reloading the page.</p>
      </div>
    );
  }

  if (!technologies || technologies.length === 0) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-100 rounded-md">
        <h3 className="text-lg font-medium mb-2">No technologies found</h3>
        <p>There are currently no technologies available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {technologies.map((tech) => (
        <Card key={tech.id} className="h-full flex flex-col shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gray-50">
            {tech.image_url && (
              <div className="aspect-video">
                <img
                  src={tech.image_url}
                  alt={tech.image_alt || tech.title}
                  className="object-cover rounded-md w-full h-full"
                />
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-4 flex-grow">
            <h3 className="text-xl font-bold mb-2">{tech.title}</h3>
            <p className="text-gray-600">{tech.description}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => navigate(`/technology/${tech.slug}`)}
            >
              Learn More <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TechnologyGrid;
