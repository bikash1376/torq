"use client";

import { CanvasComponent, useCanvasStore } from "@/lib/canvas-storage";
import { components } from "@/lib/tambo";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TamboComponent } from "@tambo-ai/react";
import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import * as React from "react";

// Define a generic component props interface that includes our canvas-specific props
type CanvasComponentProps = CanvasComponent;

export const ComponentsCanvas: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
  const {
    canvases,
    activeCanvasId,
    createCanvas,
    updateCanvas,
    removeCanvas,
    setActiveCanvas,
    clearCanvas,
    removeComponent,
    addComponent,
    moveComponent,
    reorderComponent,
  } = useCanvasStore();

  const [editingCanvasId, setEditingCanvasId] = React.useState<string | null>(
    null,
  );
  const [pendingDeleteCanvasId, setPendingDeleteCanvasId] = React.useState<
    string | null
  >(null);
  const [editingName, setEditingName] = React.useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  // Set default canvas if none exists
  React.useEffect(() => {
    // Check if localStorage already has canvases before creating a new one
    const existingStore = localStorage.getItem("tambo-canvas-storage");
    const hasExistingCanvases =
      existingStore && JSON.parse(existingStore)?.state?.canvases?.length > 0;

    // Only create a default canvas if we don't have any in storage
    if (!hasExistingCanvases && canvases.length === 0) {
      createCanvas("New Lesson 1");
    } else if (!activeCanvasId && canvases.length > 0) {
      setActiveCanvas(canvases[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on first mount

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!activeCanvasId) return;

      // If dropped outside of any droppable, or on the same item, do nothing
      if (!over || active.id === over.id) {
        return;
      }

      const activeComponentId = active.id as string;
      const overComponentId = over.id as string;

      // Check if the active item is a component within the active canvas
      const activeCanvasComponents = canvases.find(
        (c) => c.id === activeCanvasId,
      )?.components;
      const isComponentInActiveCanvas = activeCanvasComponents?.some(
        (comp) => comp.componentId === activeComponentId,
      );

      // Find the index of the component we are dropping over
      const overIndex =
        activeCanvasComponents?.findIndex(
          (c) => c.componentId === overComponentId,
        ) ?? -1;

      if (isComponentInActiveCanvas) {
        if (overIndex !== -1) {
          // This is a reorder within the same canvas
          reorderComponent(activeCanvasId, activeComponentId, overIndex);
        }
      } else {
        // This is a drag from the sidebar into the canvas
        const data = active.data.current as {
          component: string;
          props: CanvasComponentProps;
        };
        if (!data || !data.component || !data.props) return;

        const componentProps = data.props;
        const componentId = `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const insertIndex = overIndex !== -1 ? overIndex : undefined;

        addComponent(
          activeCanvasId,
          {
            ...componentProps,
            componentId,
            _inCanvas: true,
            _componentType: data.component,
          },
          insertIndex,
        ); // Add new component at the position of 'overComponentId' (index)
      }
    },
    [activeCanvasId, canvases, addComponent, moveComponent, reorderComponent],
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!activeCanvasId) return;

      const data = e.dataTransfer.getData("application/json");
      if (!data) return;

      try {
        const parsed = JSON.parse(data);
        if (!parsed.component || !parsed.props) return;

        const componentProps = parsed.props as CanvasComponentProps;
        const isMovingExisting =
          componentProps._inCanvas &&
          componentProps.componentId &&
          componentProps.canvasId;
        const sourceCanvasId = componentProps.canvasId;
        const componentId =
          componentProps.componentId ||
          `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Skip if reordering within the same canvas (handled by dnd-kit)
        if (isMovingExisting && sourceCanvasId === activeCanvasId) {
          return;
        }

        // Move component between different canvases
        if (
          isMovingExisting &&
          sourceCanvasId &&
          sourceCanvasId !== activeCanvasId
        ) {
          moveComponent(sourceCanvasId, activeCanvasId, componentId);
          return;
        }

        // Add new component to canvas
        addComponent(activeCanvasId, {
          ...componentProps,
          componentId,
          _inCanvas: true,
          _componentType: parsed.component,
        });
      } catch (err) {
        console.error("Invalid drop data", err);
      }
    },
    [activeCanvasId, addComponent, moveComponent],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect =
      e.dataTransfer.effectAllowed === "move" ? "move" : "copy";
  };

  const handleCreateCanvas = React.useCallback(() => {
    createCanvas();
  }, [createCanvas]);

  const startRenameCanvas = React.useCallback(
    (id: string) => {
      const canvas = canvases.find((c) => c.id === id);
      if (!canvas) return;
      setEditingCanvasId(id);
      setEditingName(canvas.name);
      setPendingDeleteCanvasId(null);
    },
    [canvases],
  );

  const saveRenameCanvas = React.useCallback(() => {
    if (!editingCanvasId) return;
    const name = editingName.trim();
    if (name) {
      updateCanvas(editingCanvasId, name);
    }
    setEditingCanvasId(null);
  }, [editingCanvasId, editingName, updateCanvas]);

  const handleDeleteCanvas = React.useCallback(
    (id: string, confirmed = false) => {
      if (confirmed) {
        // Confirmed deletion, actually delete the canvas
        removeCanvas(id);
        setPendingDeleteCanvasId(null);
      } else {
        // Show confirmation UI
        setPendingDeleteCanvasId(id);
        // Auto-cancel after 10 seconds if no action taken
        setTimeout(() => {
          setPendingDeleteCanvasId((current) =>
            current === id ? null : current,
          );
        }, 10000);
      }
    },
    [removeCanvas],
  );

  // Find component definition from registry
  const renderComponent = (componentProps: CanvasComponentProps) => {
    const componentType = componentProps._componentType;
    const componentDef = components.find(
      (comp: TamboComponent) => comp.name === componentType,
    );

    if (!componentDef) {
      // Silently skip unknown/deprecated component types (like old TutorConcept)
      return null;
    }

    const Component = componentDef.component;
    // Filter out our custom props that shouldn't be passed to the component
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _componentType, componentId, canvasId, _inCanvas, ...cleanProps } =
      componentProps;

    return <Component {...cleanProps} />;
  };

  const SortableItem: React.FC<{ componentProps: CanvasComponentProps }> = ({
    componentProps,
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: componentProps.componentId });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    // Extract the necessary props for the delete button
    const { canvasId, componentId, _componentType } = componentProps;

    return (
      <div className="relative group border border-transparent hover:border-border/50 rounded-xl transition-all duration-200">
        {/* Controls - visible on hover */}
        <div className="absolute -top-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          <div className="bg-background border border-border shadow-sm rounded-full flex overflow-hidden pointer-events-auto">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="p-1.5 hover:bg-muted cursor-move text-muted-foreground hover:text-foreground border-r border-border"
              title="Drag to reorder"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
            </div>

            {/* Delete Button */}
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (canvasId && componentId) {
                  removeComponent(canvasId, componentId);
                }
              }}
              className="p-1.5 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
              title="Remove"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Component Content - Ref is here for sorting, but listeners are above */}
        <div
          ref={setNodeRef}
          style={style}
          className="relative"
        >
          {renderComponent(componentProps)}
        </div>
      </div>
    );
  };

  const activeCanvas = canvases.find((c) => c.id === activeCanvasId);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn("w-full h-full flex flex-col relative", className)}
      {...props}
    >
      <div
        className={cn(
          "flex items-center overflow-x-auto p-2 pr-10 gap-1",
          "[&::-webkit-scrollbar]:w-[6px]",
          "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30",
          "[&::-webkit-scrollbar:horizontal]:h-[4px]",
        )}
      >
        {canvases.map((c) => (
          <div
            key={c.id}
            data-canvas-id={c.id}
            onClick={() => {
              setActiveCanvas(c.id);
              setPendingDeleteCanvasId(null);
            }}
            className={cn(
              "px-3 py-1 text-sm cursor-pointer whitespace-nowrap flex items-center gap-1 border-b-2",
              activeCanvasId === c.id
                ? "border-border text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {editingCanvasId === c.id ? (
              <>
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="bg-transparent border-b border-border/50 focus:outline-none text-sm w-24"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saveRenameCanvas();
                  }}
                  className="ml-1 p-0.5 hover:text-foreground"
                  title="Save"
                >
                  <CheckIcon className="h-3 w-3" />
                </button>
              </>
            ) : (
              <>
                <span>{c.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startRenameCanvas(c.id);
                  }}
                  className="ml-1 p-0.5 hover:text-foreground"
                  title="Rename"
                >
                  <PencilIcon className="h-3 w-3" />
                </button>
                {canvases.length > 1 &&
                  (pendingDeleteCanvasId === c.id ? (
                    <div className="ml-1 flex items-center gap-1 px-2 py-0.5 bg-destructive/10 rounded text-xs text-destructive">
                      <span>Delete?</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCanvas(c.id, true);
                        }}
                        className="p-0.5 hover:text-destructive"
                        title="Confirm delete"
                      >
                        <CheckIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDeleteCanvasId(null);
                        }}
                        className="p-0.5 hover:text-destructive"
                        title="Cancel delete"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCanvas(c.id);
                      }}
                      className="ml-1 p-0.5 hover:text-foreground"
                      title="Delete canvas"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  ))}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="absolute top-2 right-2 flex gap-2">
        {/* History Dropdown */}
        <div className="relative group/history">
          <button
            className="p-1 hover:text-foreground bg-background/80 backdrop-blur-sm rounded border border-transparent hover:border-border transition-all"
            title="Component History"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /><path d="M12 7v5l4 2" /></svg>
          </button>

          {/* <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover/history:opacity-100 group-hover/history:visible transition-all z-50 overflow-hidden">
            <div className="p-2 border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
              Recently Generated
            </div>
            <div className="max-h-64 overflow-y-auto">
              {useCanvasStore.getState().componentHistory?.length > 0 ? (
                useCanvasStore.getState().componentHistory.map((comp, i) => {
                  const props = comp as any;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (activeCanvasId) {
                          addComponent(activeCanvasId, { ...comp, componentId: "" }); // Create new instance
                        }
                      }}
                      className="w-full text-left p-2 text-sm hover:bg-muted transition-colors border-b border-border/50 last:border-0 truncate"
                    >
                      {comp._componentType === "TutorConcept" ? "Concept: " + (props.title || "Untitled") :
                        comp._componentType === "TutorQuiz" ? "Quiz: " + (props.question?.substring(0, 20) || "Untitled") + "..." :
                          comp._componentType === "TutorStepByStep" ? "Guide: " + (props.title || "Untitled") :
                            comp._componentType}
                    </button>
                  )
                })
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground">No history yet</div>
              )}
            </div>
          </div> */}
        </div>

        <button
          onClick={handleCreateCanvas}
          className="p-1 hover:text-foreground bg-background/80 backdrop-blur-sm rounded"
          title="New canvas"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-50 bg-background rounded-md">
        {activeCanvasId && (
          <button
            onClick={() => activeCanvasId && clearCanvas(activeCanvasId)}
            className="px-3 py-1.5 border border-border text-foreground hover:bg-muted rounded-md shadow-sm flex items-center gap-1.5 text-sm cursor-pointer"
            title="Clear canvas"
          >
            <XIcon className="h-4 w-4" />
            <span>Clear Canvas</span>
          </button>
        )}
      </div>

      <div
        className={cn(
          "flex-1 overflow-auto p-4",
          "[&::-webkit-scrollbar]:w-[6px]",
          "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30",
          "[&::-webkit-scrollbar:horizontal]:h-[4px]",
        )}
      >
        {!activeCanvas || activeCanvas.components.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
            <p className="font-medium text-lg">Your learning space is empty</p>
            <p className="text-sm">Ask your AI tutor to explain a concept, give a quiz, or show a step-by-step guide.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={activeCanvas.components.map((c) => c.componentId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid gap-4">
                {activeCanvas.components.map((c) => (
                  <SortableItem key={c.componentId} componentProps={c} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default ComponentsCanvas;
