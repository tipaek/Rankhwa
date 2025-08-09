import React from 'react';
import { ListSummary } from '@/lib/api';
import { cn } from '@/lib/cn';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/Button';

interface ListTabsProps {
  lists: ListSummary[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onCreate: () => void;
  onRename: (list: ListSummary) => void;
  onDelete: (list: ListSummary) => void;
}

/**
 * Renders tabs for all user lists.  Supports rename and delete
 * actions for non‑default lists.  A plus button triggers creation of
 * new lists.  The parent component manages the active tab and list
 * data.
 */
export const ListTabs: React.FC<ListTabsProps> = ({ lists, activeId, onSelect, onCreate, onRename, onDelete }) => {
  return (
    <div className="flex items-center overflow-x-auto border-b border-border mb-4">
      {lists.map((list) => (
        <div key={list.id} className="flex items-center mr-4">
          <button
            onClick={() => onSelect(list.id)}
            className={cn(
              'px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
              list.id === activeId ? 'border-primary text-primary' : 'border-transparent text-foreground hover:text-primary'
            )}
          >
            {list.name}
          </button>
          {!list.isDefault && list.id === activeId && (
            <div className="flex space-x-1 ml-1">
              <button
                onClick={() => onRename(list)}
                aria-label="Rename list"
                className="p-1 text-muted hover:text-primary"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(list)}
                aria-label="Delete list"
                className="p-1 text-muted hover:text-error"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={onCreate} className="p-1 ml-auto">
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
};