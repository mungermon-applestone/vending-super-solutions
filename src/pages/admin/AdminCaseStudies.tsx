import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { 
  MoreHorizontal, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Eye, 
  EyeOff 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useCaseStudies, useDeleteCaseStudy } from '@/hooks/useCaseStudies';
import DeleteEntityDialog from '@/components/admin/common/DeleteEntityDialog';

const AdminCaseStudies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string | null>(null);
  const [selectedCaseStudyTitle, setSelectedCaseStudyTitle] = useState<string>('');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAuth();
  const { data: caseStudies, isLoading: isLoadingCaseStudies } = useCaseStudies();
  const deleteCaseStudy = useDeleteCaseStudy();

  React.useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin/sign-in');
    }
  }, [isAdmin, isLoading, navigate]);

  const filteredCaseStudies = React.useMemo(() => {
    if (!caseStudies) return [];
    
    if (!searchTerm) return caseStudies;
    
    return caseStudies.filter(
      (study) => 
        study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [caseStudies, searchTerm]);

  const handleDeleteClick = (id: string, title: string) => {
    setSelectedCaseStudyId(id);
    setSelectedCaseStudyTitle(title);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCaseStudyId) return;
    
    try {
      await deleteCaseStudy.mutateAsync(selectedCaseStudyId);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting case study:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center h-64">
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Case Studies</h1>
            <p className="text-muted-foreground mt-1">
              Manage case studies for the website
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/case-studies/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Case Study
            </Link>
          </Button>
        </div>

        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search case studies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead className="hidden md:table-cell">Summary</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingCaseStudies ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading case studies...
                  </TableCell>
                </TableRow>
              ) : filteredCaseStudies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {searchTerm
                      ? "No case studies match your search"
                      : "No case studies found. Create your first one!"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCaseStudies.map((caseStudy) => (
                  <TableRow key={caseStudy.id}>
                    <TableCell className="font-medium">{caseStudy.title}</TableCell>
                    <TableCell>{caseStudy.industry || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="truncate max-w-md">
                        {caseStudy.summary}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {caseStudy.visible ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                          <Eye className="h-3 w-3 mr-1" /> Visible
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">
                          <EyeOff className="h-3 w-3 mr-1" /> Hidden
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/case-studies/${caseStudy.slug}`}>
                              <Eye className="h-4 w-4 mr-2" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/case-studies/edit/${caseStudy.slug}`}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(caseStudy.id, caseStudy.title)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <DeleteEntityDialog
        isOpen={deleteDialogOpen}
        setIsOpen={setDeleteDialogOpen}
        entityToDelete={selectedCaseStudyId ? { id: selectedCaseStudyId, title: selectedCaseStudyTitle, slug: '' } : null}
        onConfirmDelete={handleDeleteConfirm}
        isDeleting={deleteCaseStudy.isPending}
        entityType="case study"
      />
    </Layout>
  );
};

export default AdminCaseStudies;
