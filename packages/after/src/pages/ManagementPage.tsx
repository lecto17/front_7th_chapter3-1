import React, { useState, useEffect } from 'react';
import { Button, Badge } from '../components/atoms';
import { Alert, Table, Modal } from '../components/organisms';
import { FormInput, FormSelect, FormTextarea } from '../components/molecules';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import type { User } from '../services/userService';
import type { Post } from '../services/postService';
import { useTheme } from '../contexts/ThemeContext';
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

  // 🚨 Table 컴포넌트에 로직을 위임하여 간소화
  const renderTableColumns = () => {
    if (entityType === 'user') {
      return [
        { key: 'id', header: 'ID', width: '60px' },
        { key: 'username', header: '사용자명', width: '150px' },
        { key: 'email', header: '이메일' },
        { key: 'role', header: '역할', width: '120px' },
        { key: 'status', header: '상태', width: '120px' },
        { key: 'createdAt', header: '생성일', width: '120px' },
        { key: 'lastLogin', header: '마지막 로그인', width: '140px' },
        { key: 'actions', header: '관리', width: '200px' },
      ];
    } else {
      return [
        { key: 'id', header: 'ID', width: '60px' },
        { key: 'title', header: '제목' },
        { key: 'author', header: '작성자', width: '120px' },
        { key: 'category', header: '카테고리', width: '140px' },
        { key: 'status', header: '상태', width: '120px' },
        { key: 'views', header: '조회수', width: '100px' },
        { key: 'createdAt', header: '작성일', width: '120px' },
        { key: 'actions', header: '관리', width: '250px' },
      ];
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

        <div className="bg-card border border-border p-2.5">
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
              <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)}>
                새로 만들기
              </Button>
            </div>

            {showSuccessAlert && (
              <div className="mb-2.5">
                <Alert
                  variant="success"
                  title="성공"
                  onClose={() => setShowSuccessAlert(false)}
                >
                  {alertMessage}
                </Alert>
              </div>
            )}

            {showErrorAlert && (
              <div className="mb-2.5">
                <Alert
                  variant="error"
                  title="오류"
                  onClose={() => setShowErrorAlert(false)}
                >
                  {errorMessage}
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

            <div className="border border-border bg-card overflow-auto">
              <Table
                columns={renderTableColumns()}
                data={data}
                striped
                hover
                entityType={entityType}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPublish={(id) => handleStatusAction(id, 'publish')}
                onArchive={(id) => handleStatusAction(id, 'archive')}
                onRestore={(id) => handleStatusAction(id, 'restore')}
              />
            </div>
          </div>
        </div>

      </div>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setFormData({});
          }}
          title={`새 ${entityType === 'user' ? '사용자' : '게시글'} 만들기`}
          size="large"
          showFooter
          footerContent={
            <>
              <Button variant="secondary" size="md" onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({});
              }}>
                취소
              </Button>
              <Button variant="primary" size="md" onClick={handleCreate}>
                생성
              </Button>
            </>
          }
        >
          <div>
            {entityType === 'user' ? (
              <>
                <FormInput
                  name="username"
                  value={formData.username || ''}
                  onChange={(value) => setFormData({ ...formData, username: value })}
                  label="사용자명"
                  placeholder="사용자명을 입력하세요"
                  required
                  width="full"
                  fieldType="username"
                />
                <FormInput
                  name="email"
                  value={formData.email || ''}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  label="이메일"
                  placeholder="이메일을 입력하세요"
                  type="email"
                  required
                  width="full"
                  fieldType="email"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormSelect
                    name="role"
                    value={formData.role || 'user'}
                    onChange={(value) => setFormData({ ...formData, role: value })}
                    options={[
                      { value: 'user', label: '사용자' },
                      { value: 'moderator', label: '운영자' },
                      { value: 'admin', label: '관리자' },
                    ]}
                    label="역할"
                    size="md"
                  />
                  <FormSelect
                    name="status"
                    value={formData.status || 'active'}
                    onChange={(value) => setFormData({ ...formData, status: value })}
                    options={[
                      { value: 'active', label: '활성' },
                      { value: 'inactive', label: '비활성' },
                      { value: 'suspended', label: '정지' },
                    ]}
                    label="상태"
                    size="md"
                  />
                </div>
              </>
            ) : (
              <>
                <FormInput
                  name="title"
                  value={formData.title || ''}
                  onChange={(value) => setFormData({ ...formData, title: value })}
                  label="제목"
                  placeholder="게시글 제목을 입력하세요"
                  required
                  width="full"
                  fieldType="postTitle"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormInput
                    name="author"
                    value={formData.author || ''}
                    onChange={(value) => setFormData({ ...formData, author: value })}
                    label="작성자"
                    placeholder="작성자명"
                    required
                    width="full"
                  />
                  <FormSelect
                    name="category"
                    value={formData.category || ''}
                    onChange={(value) => setFormData({ ...formData, category: value })}
                    options={[
                      { value: 'development', label: 'Development' },
                      { value: 'design', label: 'Design' },
                      { value: 'accessibility', label: 'Accessibility' },
                    ]}
                    label="카테고리"
                    placeholder="카테고리 선택"
                    size="md"
                  />
                </div>
                <FormTextarea
                  name="content"
                  value={formData.content || ''}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  label="내용"
                  placeholder="게시글 내용을 입력하세요"
                  rows={6}
                />
              </>
            )}
          </div>
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setFormData({});
            setSelectedItem(null);
          }}
          title={`${entityType === 'user' ? '사용자' : '게시글'} 수정`}
          size="large"
          showFooter
          footerContent={
            <>
              <Button variant="secondary" size="md" onClick={() => {
                setIsEditModalOpen(false);
                setFormData({});
                setSelectedItem(null);
              }}>
                취소
              </Button>
              <Button variant="primary" size="md" onClick={handleUpdate}>
                수정 완료
              </Button>
            </>
          }
        >
          <div>
            {selectedItem && (
              <Alert variant="info">
                ID: {selectedItem.id} | 생성일: {selectedItem.createdAt}
                {entityType === 'post' && ` | 조회수: ${(selectedItem as Post).views}`}
              </Alert>
            )}

            {entityType === 'user' ? (
              <>
                <FormInput
                  name="username"
                  value={formData.username || ''}
                  onChange={(value) => setFormData({ ...formData, username: value })}
                  label="사용자명"
                  placeholder="사용자명을 입력하세요"
                  required
                  width="full"
                  fieldType="username"
                />
                <FormInput
                  name="email"
                  value={formData.email || ''}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  label="이메일"
                  placeholder="이메일을 입력하세요"
                  type="email"
                  required
                  width="full"
                  fieldType="email"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormSelect
                    name="role"
                    value={formData.role || 'user'}
                    onChange={(value) => setFormData({ ...formData, role: value })}
                    options={[
                      { value: 'user', label: '사용자' },
                      { value: 'moderator', label: '운영자' },
                      { value: 'admin', label: '관리자' },
                    ]}
                    label="역할"
                    size="md"
                  />
                  <FormSelect
                    name="status"
                    value={formData.status || 'active'}
                    onChange={(value) => setFormData({ ...formData, status: value })}
                    options={[
                      { value: 'active', label: '활성' },
                      { value: 'inactive', label: '비활성' },
                      { value: 'suspended', label: '정지' },
                    ]}
                    label="상태"
                    size="md"
                  />
                </div>
              </>
            ) : (
              <>
                <FormInput
                  name="title"
                  value={formData.title || ''}
                  onChange={(value) => setFormData({ ...formData, title: value })}
                  label="제목"
                  placeholder="게시글 제목을 입력하세요"
                  required
                  width="full"
                  fieldType="postTitle"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormInput
                    name="author"
                    value={formData.author || ''}
                    onChange={(value) => setFormData({ ...formData, author: value })}
                    label="작성자"
                    placeholder="작성자명"
                    required
                    width="full"
                  />
                  <FormSelect
                    name="category"
                    value={formData.category || ''}
                    onChange={(value) => setFormData({ ...formData, category: value })}
                    options={[
                      { value: 'development', label: 'Development' },
                      { value: 'design', label: 'Design' },
                      { value: 'accessibility', label: 'Accessibility' },
                    ]}
                    label="카테고리"
                    placeholder="카테고리 선택"
                    size="md"
                  />
                </div>
                <FormTextarea
                  name="content"
                  value={formData.content || ''}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  label="내용"
                  placeholder="게시글 내용을 입력하세요"
                  rows={6}
                />
              </>
            )}
          </div>
        </Modal>
    </div>
  );
};
