import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { Post } from '@/services/postService';

interface PostTableProps {
  posts: Post[];
  isLoading: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  onPublish: (id: number) => void;
  onArchive: (id: number) => void;
  onRestore: (id: number) => void;
}

export const PostTable: React.FC<PostTableProps> = ({
  posts,
  isLoading,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
  onRestore
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'development':
        return 'default';
      case 'design':
        return 'info';
      case 'accessibility':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return '게시됨';
      case 'draft':
        return '임시저장';
      case 'archived':
        return '보관됨';
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    return category;
  };

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  return (
    <div className="border border-border bg-card overflow-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="border-b-2 border-border hover:bg-transparent">
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '60px' }}
            >
              ID
            </TableHead>
            <TableHead className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase">
              제목
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '120px' }}
            >
              작성자
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '140px' }}
            >
              카테고리
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '120px' }}
            >
              상태
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '100px' }}
            >
              조회수
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '120px' }}
            >
              작성일
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '250px' }}
            >
              관리
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow
              key={post.id}
              className="even:bg-muted/50 hover:bg-muted/50 border-b border-border data-[state=selected]:bg-muted"
            >
              <TableCell className="py-4 px-4 text-sm text-foreground">
                {post.id}
              </TableCell>
              <TableCell className="py-4 px-4 text-sm font-medium text-foreground">
                {post.title}
              </TableCell>
              <TableCell className="py-4 px-4 text-sm text-foreground">
                {post.author}
              </TableCell>
              <TableCell className="py-4 px-4">
                <Badge
                  variant={getCategoryBadgeVariant(post.category)}
                  className="rounded-full"
                >
                  {getCategoryLabel(post.category)}
                </Badge>
              </TableCell>
              <TableCell className="py-4 px-4">
                <Badge variant={getStatusBadgeVariant(post.status)}>
                  {getStatusLabel(post.status)}
                </Badge>
              </TableCell>
              <TableCell className="py-4 px-4 text-sm text-foreground">
                {post.views}
              </TableCell>
              <TableCell className="py-4 px-4 text-sm text-foreground">
                {post.createdAt}
              </TableCell>
              <TableCell className="py-4 px-4">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    className="bg-[#1976d2] hover:bg-[#1565c0] text-white"
                    onClick={() => onEdit(post)}
                  >
                    수정
                  </Button>
                  {post.status === 'draft' && (
                    <Button
                      size="sm"
                      className="bg-[#388e3c] hover:bg-[#2e7d32] text-white"
                      onClick={() => onPublish(post.id)}
                    >
                      게시
                    </Button>
                  )}
                  {post.status === 'published' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onArchive(post.id)}
                    >
                      보관
                    </Button>
                  )}
                  {post.status === 'archived' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onRestore(post.id)}
                    >
                      복원
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(post.id)}
                  >
                    삭제
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
