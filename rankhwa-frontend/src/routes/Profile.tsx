import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/auth.store';
import {
  getLists,
  createList,
  renameList,
  deleteList,
  getListDetail,
  ListSummary,
  ListDetail,
} from '@/lib/api';
import { ListTabs } from '@/features/lists/ListTabs';
import { ManhwaCardList } from '@/features/lists/ManhwaCardList';
import { Dialog } from '@/components/Dialog';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: lists } = useQuery(['lists'], getLists, { staleTime: 1000 * 60 });
  const [activeId, setActiveId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showRename, setShowRename] = useState<null | ListSummary>(null);
  const [showDelete, setShowDelete] = useState<null | ListSummary>(null);
  const [listName, setListName] = useState('');

  useEffect(() => {
    if (!lists || lists.length === 0) return;
    if (activeId === null) setActiveId(lists[0].id);
  }, [lists, activeId]);

  // Mutation for creating a list
  const createMutation = useMutation(createList, {
    onSuccess: (newList) => {
      queryClient.invalidateQueries(['lists']);
      setActiveId(newList.id);
      toast({ title: 'List created', variant: 'success' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message || 'Could not create list', variant: 'error' }),
  });
  // Mutation for renaming a list
  const renameMutation = useMutation(({ id, name }: { id: number; name: string }) => renameList(id, name), {
    onSuccess: () => {
      queryClient.invalidateQueries(['lists']);
      toast({ title: 'List renamed', variant: 'success' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message || 'Could not rename', variant: 'error' }),
  });
  // Mutation for deleting a list
  const deleteMutation = useMutation((id: number) => deleteList(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['lists']);
      // After deletion pick another list
      setActiveId((prev) => {
        const remaining = lists?.filter((l) => l.id !== prev);
        return remaining && remaining.length > 0 ? remaining[0].id : null;
      });
      toast({ title: 'List deleted', variant: 'success' });
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message || 'Could not delete list', variant: 'error' }),
  });

  // Fetch selected list detail (IDs)
  const { data: listDetail } = useQuery(
    ['list', activeId],
    () => getListDetail(activeId as number),
    {
      enabled: activeId != null,
    }
  );

  if (!user) {
    // Should be guarded by Protected route, but fallback if navigated directly
    return <p className="p-4">Please log in to view your profile.</p>;
  }
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">My Lists</h1>
      {lists && lists.length > 0 ? (
        <>
          <ListTabs
            lists={lists}
            activeId={activeId}
            onSelect={(id) => setActiveId(id)}
            onCreate={() => setShowCreate(true)}
            onRename={(list) => {
              setShowRename(list);
              setListName(list.name);
            }}
            onDelete={(list) => setShowDelete(list)}
          />
          {activeId != null && listDetail ? (
            <ManhwaCardList listId={activeId} manhwaIds={listDetail.manhwaIds} />
          ) : (
            <p className="text-muted">Select a list to view its contents.</p>
          )}
        </>
      ) : (
        <div>
          <p className="text-muted mb-4">You haven&apos;t created any lists yet.</p>
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            Create your first list
          </Button>
        </div>
      )}
      {/* Create dialog */}
      <Dialog
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create a new list"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!listName.trim()) return;
                createMutation.mutate(listName.trim());
                setListName('');
                setShowCreate(false);
              }}
            >
              Create
            </Button>
          </>
        }
      >
        <Input
          id="create-list-name"
          label="List name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          autoFocus
        />
      </Dialog>
      {/* Rename dialog */}
      <Dialog
        isOpen={!!showRename}
        onClose={() => setShowRename(null)}
        title="Rename list"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowRename(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!showRename) return;
                const id = showRename.id;
                renameMutation.mutate({ id, name: listName.trim() });
                setShowRename(null);
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <Input
          id="rename-list-name"
          label="List name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          autoFocus
        />
      </Dialog>
      {/* Delete confirm dialog */}
      <Dialog
        isOpen={!!showDelete}
        onClose={() => setShowDelete(null)}
        title="Delete list"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!showDelete) return;
                deleteMutation.mutate(showDelete.id);
                setShowDelete(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete the list &ldquo;{showDelete?.name}&rdquo;? This cannot be undone.</p>
      </Dialog>
    </div>
  );
};

export default ProfilePage;