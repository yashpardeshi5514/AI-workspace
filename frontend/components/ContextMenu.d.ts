interface ContextMenuProps {
    x: number;
    y: number;
    onRename?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onCreateFolder?: () => void;
    isDirectory?: boolean;
}
export declare function ContextMenu({ x, y, onRename, onDelete, onDuplicate, onCreateFolder, isDirectory, }: ContextMenuProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ContextMenu.d.ts.map