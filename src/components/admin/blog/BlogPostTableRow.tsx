
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import CloneButton from '@/components/admin/common/CloneButton';
import { BlogPost } from '@/types/blog';

interface BlogPostTableRowProps {
  post: BlogPost;
  onDeleteClick: () => void;
  onCloneClick: () => Promise<void>;
  isCloningId: string | null;
}

const BlogPostTableRow: React.FC<BlogPostTableRowProps> = ({
  post,
  onDeleteClick,
  onCloneClick,
  isCloningId,
}) => {
  const navigate = useNavigate();
  const isCloning = isCloningId === post.id;
  
  return (
    <TableRow>
      <TableCell className="font-medium">{post.title}</TableCell>
      
      <TableCell>
        <div className="font-mono text-sm text-gray-500">
          {post.slug}
        </div>
      </TableCell>
      
      <TableCell>
        {post.status === 'published' ? (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Published
          </span>
        ) : (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Draft
          </span>
        )}
      </TableCell>
      
      <TableCell>
        {post.status === 'published' && post.published_at ? (
          format(new Date(post.published_at), 'MMM d, yyyy')
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/blog/${post.slug}`)}
            title="View post"
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" /> View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
            title="Edit post"
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          
          <CloneButton
            onClone={onCloneClick}
            itemName={post.title}
            isCloning={isCloning}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDeleteClick}
            title="Delete post"
            className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default BlogPostTableRow;
