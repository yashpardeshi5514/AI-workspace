export interface FileTreeItem {
    _id: string;
    filename: string;
    path: string;
    isDirectory: boolean;
    children?: FileTreeItem[];
}
interface FileTreeProps {
    items: FileTreeItem[];
    onSelect: (item: FileTreeItem) => void;
    onContextMenu?: (item: FileTreeItem, e: React.MouseEvent) => void;
    selectedId?: string;
}
export declare function FileTree({ items, onSelect, onContextMenu, selectedId, }: FileTreeProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=FileTree.d.ts.map