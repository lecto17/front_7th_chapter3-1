import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { Post } from "../../services/postService";

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
  onRestore,
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "secondary";
      default:
        return "default";
    }
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "development":
        return "default";
      case "design":
        return "secondary";
      case "accessibility":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "게시됨";
      case "draft":
        return "임시저장";
      case "archived":
        return "보관됨";
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "development":
        return "개발";
      case "design":
        return "디자인";
      case "accessibility":
        return "접근성";
      default:
        return category;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead>작성자</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>조회수</TableHead>
          <TableHead className="text-right">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id} className="hover:bg-muted/50">
            <TableCell className="text-foreground">{post.id}</TableCell>
            <TableCell className="font-medium text-foreground">
              {post.title}
            </TableCell>
            <TableCell className="text-foreground">{post.author}</TableCell>
            <TableCell>
              <Badge variant={getCategoryBadgeVariant(post.category)}>
                {getCategoryLabel(post.category)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(post.status)}>
                {getStatusLabel(post.status)}
              </Badge>
            </TableCell>
            <TableCell className="text-foreground">{post.views}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(post)}
                >
                  수정
                </Button>
                {post.status === "draft" && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onPublish(post.id)}
                  >
                    게시
                  </Button>
                )}
                {post.status === "published" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onArchive(post.id)}
                  >
                    보관
                  </Button>
                )}
                {post.status === "archived" && (
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
  );
};
