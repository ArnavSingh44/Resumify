import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

const SortableSection = ({ id, content, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute -left-12 top-0 bottom-0 w-8 items-center justify-center cursor-grab active:cursor-grabbing hidden lg:flex opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 hover:bg-white/10 text-gray-500 hover:text-blue-400 transition-all">
          <GripVertical className="w-5 h-5" />
        </div>
      </div>

      {/* Mobile Handle & Delete */}
      <div className="lg:hidden flex justify-between items-center mb-4 bg-white/5 p-3 rounded-2xl border border-white/10">
        <div {...attributes} {...listeners} className="flex items-center space-x-2 text-gray-400">
          <GripVertical className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Hold to drag</span>
        </div>
        {onRemove && (
            <button 
                onClick={() => onRemove(id)}
                className="p-2 bg-red-500/10 text-red-500 rounded-lg"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        )}
      </div>

      {/* Remove Button (Desktop) */}
      {onRemove && (
        <button 
            onClick={() => onRemove(id)}
            className="absolute -right-12 top-0 p-3 bg-red-500/5 text-red-500/40 rounded-2xl border border-red-500/10 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100 hidden lg:flex"
            title="Remove Section"
        >
            <Trash2 className="w-5 h-5" />
        </button>
      )}

      <div className={`${isDragging ? 'ring-2 ring-blue-500/50 rounded-[2rem]' : ''}`}>
        {content}
      </div>
    </div>
  );
};

export default SortableSection;
