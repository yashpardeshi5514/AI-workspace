interface CreateDialogProps {
    workspaceId: string;
    parentPath: string;
    type: 'file' | 'folder';
    onSuccess?: () => void;
    onClose?: () => void;
}
export declare function CreateDialog({ workspaceId, parentPath, type, onSuccess, onClose, }: CreateDialogProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=CreateDialog.d.ts.map