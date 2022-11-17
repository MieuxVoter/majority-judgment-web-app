import {useSortable} from '@dnd-kit/sortable';

export interface SortableInterface {
  id: string | number;
  children: React.ReactNode;
  className?: string;
}

export default ({id, children, className = ""}: SortableInterface) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id});

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : null,
    transition,
  };

  return (
    <div ref={setNodeRef} className={className} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
