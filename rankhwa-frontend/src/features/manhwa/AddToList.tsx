import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { Dropdown } from '@/components/Dropdown';
import { Dialog } from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/components/Toast';

interface AddToListProps {
  manhwaId: number;
}

/**
 * Presents a dropdown of user lists and allows adding the given
 * manhwa to a selected list.  Users can also create a new list on
 * the fly via a modal dialog.
 */
export const AddToList: React.FC<AddToListProps> = ({ manhwaId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: lists } = useQuery(['lists'], api.getLists, {
    // Only fetch lists when user is authenticated; handled upstream.
    staleTime: 1000 * 60,
  });
  const addItemMutation = useMutation(
    async (listId: number) => {
      await api.addItemToList(listId, manhwaId);
      return listId;
    },
    {
      onSuccess: (listId) => {
        // Invalidate list details so that counts update.
        queryClient.invalidateQueries(['lists']);
        queryClient.invalidateQueries(['list', listId]);
        toast({ title: 'Added to list', description: 'Manhwa added successfully', variant: 'success' });
      },
      onError: (error: any) => {
        toast({ title: 'Error', description: error.message || 'Failed to add to list', variant: 'error' });
      },
    }
  );
  const createListMutation = useMutation(api.createList, {
    onSuccess: (list) => {
      queryClient.invalidateQueries(['lists']);
      // Immediately add to new list
      addItemMutation.mutate(list.id);
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Could not create list', variant: 'error' });
    },
  });

  const [showDialog, setShowDialog] = useState(false);
  const [newListName, setNewListName] = useState('');

  if (!lists) return null;

  const items = [
    ...lists.map((list) => ({
      label: list.name,
      onSelect: () => addItemMutation.mutate(list.id),
    })),
    { label: 'Create new list…', onSelect: () => setShowDialog(true) },
  ];

  return (
    <>
      <Dropdown
        items={items}
        trigger={
          <Button variant="ghost" size="sm" className="p-1">
            <Plus className="w-5 h-5" />
          </Button>
        }
      />
      <Dialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        title="Create new list"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!newListName.trim()) return;
                createListMutation.mutate(newListName.trim());
                setNewListName('');
                setShowDialog(false);
              }}
            >
              Create
            </Button>
          </>
        }
      >
        <Input
          id="new-list-name"
          label="List name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="e.g. Favourites"
          autoFocus
        />
      </Dialog>
    </>
  );
};