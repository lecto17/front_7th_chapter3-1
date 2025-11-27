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
import type { User } from '@/services/userService';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onEdit,
  onDelete
}) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return '관리자';
      case 'moderator':
        return '운영자';
      case 'user':
        return '사용자';
      default:
        return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'inactive':
        return '비활성';
      case 'suspended':
        return '정지';
      default:
        return status;
    }
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
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '150px' }}
            >
              사용자명
            </TableHead>
            <TableHead className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase">
              이메일
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '120px' }}
            >
              역할
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '120px' }}
            >
              상태
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '120px' }}
            >
              생성일
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '140px' }}
            >
              마지막 로그인
            </TableHead>
            <TableHead
              className="h-auto py-4 px-4 text-xs font-medium text-muted-foreground uppercase"
              style={{ width: '200px' }}
            >
              관리
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow
              key={user.id}
              className="even:bg-muted/50 hover:bg-muted/50 border-b border-border data-[state=selected]:bg-muted"
            >
              <TableCell className="py-4 px-4 text-sm text-foreground">
                {user.id}
              </TableCell>
              <TableCell className="py-4 px-4 text-sm font-medium text-foreground">
                {user.username}
              </TableCell>
              <TableCell className="py-4 px-4 text-sm text-foreground">
                {user.email}
              </TableCell>
              <TableCell className="py-4 px-4">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </TableCell>
              <TableCell className="py-4 px-4">
                <Badge variant={getStatusBadgeVariant(user.status)}>
                  {getStatusLabel(user.status)}
                </Badge>
              </TableCell>
              <TableCell className="py-4 px-4 text-sm text-foreground">
                {user.createdAt}
              </TableCell>
              <TableCell className="py-4 px-4 text-sm text-foreground">
                {user.lastLogin || '-'}
              </TableCell>
              <TableCell className="py-4 px-4">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-[#1976d2] hover:bg-[#1565c0] text-white"
                    onClick={() => onEdit(user)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(user.id)}
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
