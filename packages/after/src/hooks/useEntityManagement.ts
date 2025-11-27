import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import { postService } from "../services/postService";
import type { User } from "../services/userService";
import type { Post } from "../services/postService";

type EntityType = "user" | "post";
type Entity = User | Post;

interface UseEntityManagementReturn<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  create: (item: Partial<T>) => Promise<void>;
  update: (id: number, item: Partial<T>) => Promise<void>;
  deleteEntity: (id: number) => Promise<void>;
}

export function useEntityManagement<T extends Entity>(
  entityType: EntityType
): UseEntityManagementReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const service = entityType === "user" ? userService : postService;

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await service.getAll();
      setData(result as T[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("데이터를 불러오는데 실패했습니다")
      );
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const create = useCallback(
    async (item: Partial<T>) => {
      setError(null);
      try {
        await service.create(item as any);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("생성에 실패했습니다"));
        throw err;
      }
    },
    [service, refresh]
  );

  const update = useCallback(
    async (id: number, item: Partial<T>) => {
      setError(null);
      try {
        await service.update(id, item as any);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("수정에 실패했습니다"));
        throw err;
      }
    },
    [service, refresh]
  );

  const deleteEntity = useCallback(
    async (id: number) => {
      setError(null);
      try {
        await service.delete(id);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("삭제에 실패했습니다"));
        throw err;
      }
    },
    [service, refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    isLoading,
    error,
    refresh,
    create,
    update,
    deleteEntity,
  };
}
