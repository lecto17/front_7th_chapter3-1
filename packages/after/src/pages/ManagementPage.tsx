import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import type { User } from '../services/userService';
import type { Post } from '../services/postService';
import { useTheme } from '../contexts/ThemeContext';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import '../styles/components.css';

type EntityType = 'user' | 'post';
type Entity = User | Post;

export const ManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const [entityType, setEntityType] = useState<EntityType>('post');
  const [data, setData] = useState<Entity[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
    setFormData({});
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  }, [entityType]);

  const loadData = async () => {
    try {
      let result: Entity[];

      if (entityType === 'user') {
        result = await userService.getAll();
      } else {
        result = await postService.getAll();
      }

      setData(result);
    } catch (error: any) {
      setErrorMessage('데이터를 불러오는데 실패했습니다');
      setShowErrorAlert(true);
    }
  };

  const handleCreate = async () => {
    try {
      if (entityType === 'user') {
        await userService.create({
          username: formData.username,
          email: formData.email,
          role: formData.role || 'user',
          status: formData.status || 'active',
        });
      } else {
        await postService.create({
          title: formData.title,
          content: formData.content || '',
          author: formData.author,
          category: formData.category,
          status: formData.status || 'draft',
        });
      }

      await loadData();
      setIsCreateModalOpen(false);
      setFormData({});
      setAlertMessage(`${entityType === 'user' ? '사용자' : '게시글'}가 생성되었습니다`);
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || '생성에 실패했습니다');
      setShowErrorAlert(true);
    }
  };

  const handleEdit = (item: Entity) => {
    setSelectedItem(item);

    if (entityType === 'user') {
      const user = item as User;
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      const post = item as Post;
      setFormData({
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        status: post.status,
      });
    }

    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    try {
      if (entityType === 'user') {
        await userService.update(selectedItem.id, formData);
      } else {
        await postService.update(selectedItem.id, formData);
      }

      await loadData();
      setIsEditModalOpen(false);
      setFormData({});
      setSelectedItem(null);
      setAlertMessage(`${entityType === 'user' ? '사용자' : '게시글'}가 수정되었습니다`);
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || '수정에 실패했습니다');
      setShowErrorAlert(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      if (entityType === 'user') {
        await userService.delete(id);
      } else {
        await postService.delete(id);
      }

      await loadData();
      setAlertMessage('삭제되었습니다');
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || '삭제에 실패했습니다');
      setShowErrorAlert(true);
    }
  };

  const handleStatusAction = async (id: number, action: 'publish' | 'archive' | 'restore') => {
    if (entityType !== 'post') return;

    try {
      if (action === 'publish') {
        await postService.publish(id);
      } else if (action === 'archive') {
        await postService.archive(id);
      } else if (action === 'restore') {
        await postService.restore(id);
      }

      await loadData();
      const message =
        action === 'publish' ? '게시' :
        action === 'archive' ? '보관' :
        '복원';
      setAlertMessage(`${message}되었습니다`);
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || '작업에 실패했습니다');
      setShowErrorAlert(true);
    }
  };

  const getStats = () => {
    if (entityType === 'user') {
      const users = data as User[];
      return {
        total: users.length,
        stat1: { label: '활성', value: users.filter(u => u.status === 'active').length, color: '#2e7d32' },
        stat2: { label: '비활성', value: users.filter(u => u.status === 'inactive').length, color: '#ed6c02' },
        stat3: { label: '정지', value: users.filter(u => u.status === 'suspended').length, color: '#d32f2f' },
        stat4: { label: '관리자', value: users.filter(u => u.role === 'admin').length, color: '#1976d2' },
      };
    } else {
      const posts = data as Post[];
      return {
        total: posts.length,
        stat1: { label: '게시됨', value: posts.filter(p => p.status === 'published').length, color: '#2e7d32' },
        stat2: { label: '임시저장', value: posts.filter(p => p.status === 'draft').length, color: '#ed6c02' },
        stat3: { label: '보관됨', value: posts.filter(p => p.status === 'archived').length, color: 'rgba(0, 0, 0, 0.6)' },
        stat4: { label: '총 조회수', value: posts.reduce((sum, p) => sum + p.views, 0), color: '#1976d2' },
      };
    }
  };

  const getBadgeVariant = (status: string, type: 'user' | 'post' | 'role' | 'category') => {
    if (type === 'user') {
      switch (status) {
        case 'active': return 'success';
        case 'inactive': return 'warning';
        case 'suspended': return 'destructive';
        default: return 'default';
      }
    } else if (type === 'post') {
      switch (status) {
        case 'published': return 'success';
        case 'draft': return 'warning';
        case 'archived': return 'secondary';
        default: return 'default';
      }
    } else if (type === 'role') {
      switch (status) {
        case 'admin': return 'destructive';
        case 'moderator': return 'default';
        case 'user': return 'secondary';
        default: return 'default';
      }
    } else if (type === 'category') {
      switch (status) {
        case 'development': return 'default';
        case 'design': return 'secondary';
        case 'accessibility': return 'outline';
        default: return 'default';
      }
    }
    return 'default';
  };

  const renderTableRow = (item: Entity) => {
    if (entityType === 'user') {
      const user = item as User;
      return (
        <TableRow key={user.id} className="hover:bg-muted/50">
          <TableCell>{user.id}</TableCell>
          <TableCell className="font-medium">{user.username}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            <Badge variant={getBadgeVariant(user.role, 'role')}>
              {user.role === 'admin' ? '관리자' : user.role === 'moderator' ? '운영자' : '사용자'}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant={getBadgeVariant(user.status, 'user')}>
              {user.status === 'active' ? '활성' : user.status === 'inactive' ? '비활성' : '정지'}
            </Badge>
          </TableCell>
          <TableCell className="text-sm text-muted-foreground">{user.createdAt}</TableCell>
          <TableCell className="text-sm text-muted-foreground">{user.lastLogin || '-'}</TableCell>
          <TableCell>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                수정
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                삭제
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );
    } else {
      const post = item as Post;
      return (
        <TableRow key={post.id} className="hover:bg-muted/50">
          <TableCell>{post.id}</TableCell>
          <TableCell className="font-medium">{post.title}</TableCell>
          <TableCell>{post.author}</TableCell>
          <TableCell>
            <Badge variant={getBadgeVariant(post.category, 'category')}>
              {post.category}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant={getBadgeVariant(post.status, 'post')}>
              {post.status === 'published' ? '게시됨' : post.status === 'draft' ? '임시저장' : '보관됨'}
            </Badge>
          </TableCell>
          <TableCell className="text-center">{post.views}</TableCell>
          <TableCell className="text-sm text-muted-foreground">{post.createdAt}</TableCell>
          <TableCell>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                수정
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                삭제
              </Button>
              {post.status === 'draft' && (
                <Button variant="default" size="sm" onClick={() => handleStatusAction(post.id, 'publish')}>
                  게시
                </Button>
              )}
              {post.status === 'published' && (
                <Button variant="secondary" size="sm" onClick={() => handleStatusAction(post.id, 'archive')}>
                  보관
                </Button>
              )}
              {post.status === 'archived' && (
                <Button variant="default" size="sm" onClick={() => handleStatusAction(post.id, 'restore')}>
                  복원
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      );
    }
  };

  const stats = getStats();

  return (
    <div className="bg-muted py-5">
      <div className="max-w-7xl mx-auto px-5">
        <div className="mb-5">
          <h1 className="text-2xl font-bold mb-1 text-foreground">
            관리 시스템
          </h1>
          <p className="text-muted-foreground text-sm">
            사용자와 게시글을 관리하세요
          </p>
        </div>

        <div className="bg-card border border-border p-2.5 rounded-lg">
          <div className="mb-4 border-b-2 border-border pb-1.5">
            <button
              onClick={() => setEntityType('post')}
              className={`px-4 py-2 mr-1.5 text-sm border rounded cursor-pointer ${
                entityType === 'post'
                  ? 'font-bold bg-primary text-primary-foreground border-primary'
                  : 'font-normal bg-secondary text-secondary-foreground border-border'
              }`}
            >
              게시글
            </button>
            <button
              onClick={() => setEntityType('user')}
              className={`px-4 py-2 text-sm border rounded cursor-pointer ${
                entityType === 'user'
                  ? 'font-bold bg-primary text-primary-foreground border-primary'
                  : 'font-normal bg-secondary text-secondary-foreground border-border'
              }`}
            >
              사용자
            </button>
          </div>

          <div>
            <div className="mb-4 text-right">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                새로 만들기
              </Button>
            </div>

            {showSuccessAlert && (
              <div className="mb-2.5 relative">
                <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-200">성공</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    {alertMessage}
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => setShowSuccessAlert(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Alert>
              </div>
            )}

            {showErrorAlert && (
              <div className="mb-2.5 relative">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => setShowErrorAlert(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Alert>
              </div>
            )}

            <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5 mb-4">
              <div className="p-3 rounded" style={{
                backgroundColor: theme === 'dark' ? '#1e3a5f' : '#e3f2fd',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: theme === 'dark' ? '#2563eb' : '#90caf9'
              }}>
                <div className="text-xs mb-1" style={{ color: theme === 'dark' ? '#94a3b8' : '#666' }}>전체</div>
                <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#60a5fa' : '#1976d2' }}>{stats.total}</div>
              </div>

              <div className="p-3 rounded" style={{
                backgroundColor: theme === 'dark' ? '#1e4620' : '#e8f5e9',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: theme === 'dark' ? '#22c55e' : '#81c784'
              }}>
                <div className="text-xs mb-1" style={{ color: theme === 'dark' ? '#94a3b8' : '#666' }}>{stats.stat1.label}</div>
                <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#4ade80' : stats.stat1.color }}>{stats.stat1.value}</div>
              </div>

              <div className="p-3 rounded" style={{
                backgroundColor: theme === 'dark' ? '#4a3410' : '#fff3e0',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: theme === 'dark' ? '#f59e0b' : '#ffb74d'
              }}>
                <div className="text-xs mb-1" style={{ color: theme === 'dark' ? '#94a3b8' : '#666' }}>{stats.stat2.label}</div>
                <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#fbbf24' : stats.stat2.color }}>{stats.stat2.value}</div>
              </div>

              <div className="p-3 rounded" style={{
                backgroundColor: theme === 'dark' ? '#4a1e3a' : '#fce4ec',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: theme === 'dark' ? '#ec4899' : '#f48fb1'
              }}>
                <div className="text-xs mb-1" style={{ color: theme === 'dark' ? '#94a3b8' : '#666' }}>{stats.stat3.label}</div>
                <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#f472b6' : stats.stat3.color }}>{stats.stat3.value}</div>
              </div>

              <div className="p-3 rounded" style={{
                backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f5f5f5',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: theme === 'dark' ? '#525252' : '#e0e0e0'
              }}>
                <div className="text-xs mb-1" style={{ color: theme === 'dark' ? '#94a3b8' : '#666' }}>{stats.stat4.label}</div>
                <div className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#a3a3a3' : stats.stat4.color }}>{stats.stat4.value}</div>
              </div>
            </div>

            <div className="border border-border bg-card overflow-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    {entityType === 'user' ? (
                      <>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead className="w-[150px]">사용자명</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead className="w-[120px]">역할</TableHead>
                        <TableHead className="w-[120px]">상태</TableHead>
                        <TableHead className="w-[120px]">생성일</TableHead>
                        <TableHead className="w-[140px]">마지막 로그인</TableHead>
                        <TableHead className="w-[200px]">관리</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead>제목</TableHead>
                        <TableHead className="w-[120px]">작성자</TableHead>
                        <TableHead className="w-[140px]">카테고리</TableHead>
                        <TableHead className="w-[120px]">상태</TableHead>
                        <TableHead className="w-[100px]">조회수</TableHead>
                        <TableHead className="w-[120px]">작성일</TableHead>
                        <TableHead className="w-[250px]">관리</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map(item => renderTableRow(item))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>새 {entityType === 'user' ? '사용자' : '게시글'} 만들기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {entityType === 'user' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">사용자명 *</Label>
                  <Input
                    id="username"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="사용자명을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">역할</Label>
                    <Select value={formData.role || 'user'} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="역할 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">사용자</SelectItem>
                        <SelectItem value="moderator">운영자</SelectItem>
                        <SelectItem value="admin">관리자</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">상태</Label>
                    <Select value={formData.status || 'active'} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">활성</SelectItem>
                        <SelectItem value="inactive">비활성</SelectItem>
                        <SelectItem value="suspended">정지</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="게시글 제목을 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">작성자 *</Label>
                    <Input
                      id="author"
                      value={formData.author || ''}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="작성자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리</Label>
                    <Select value={formData.category || ''} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="accessibility">Accessibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">내용</Label>
                  <Textarea
                    id="content"
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="게시글 내용을 입력하세요"
                    rows={6}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => {
              setIsCreateModalOpen(false);
              setFormData({});
            }}>
              취소
            </Button>
            <Button onClick={handleCreate}>
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{entityType === 'user' ? '사용자' : '게시글'} 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedItem && (
              <Alert>
                <AlertDescription>
                  ID: {selectedItem.id} | 생성일: {selectedItem.createdAt}
                  {entityType === 'post' && ` | 조회수: ${(selectedItem as Post).views}`}
                </AlertDescription>
              </Alert>
            )}

            {entityType === 'user' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-username">사용자명 *</Label>
                  <Input
                    id="edit-username"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="사용자명을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">이메일 *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">역할</Label>
                    <Select value={formData.role || 'user'} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger id="edit-role">
                        <SelectValue placeholder="역할 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">사용자</SelectItem>
                        <SelectItem value="moderator">운영자</SelectItem>
                        <SelectItem value="admin">관리자</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">상태</Label>
                    <Select value={formData.status || 'active'} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">활성</SelectItem>
                        <SelectItem value="inactive">비활성</SelectItem>
                        <SelectItem value="suspended">정지</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-title">제목 *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="게시글 제목을 입력하세요"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-author">작성자 *</Label>
                    <Input
                      id="edit-author"
                      value={formData.author || ''}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="작성자명"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">카테고리</Label>
                    <Select value={formData.category || ''} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="accessibility">Accessibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-content">내용</Label>
                  <Textarea
                    id="edit-content"
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="게시글 내용을 입력하세요"
                    rows={6}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => {
              setIsEditModalOpen(false);
              setFormData({});
              setSelectedItem(null);
            }}>
              취소
            </Button>
            <Button onClick={handleUpdate}>
              수정 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
