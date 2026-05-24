interface CollaborativeEditorProps {
    fileId: string;
    content: string;
    language?: string;
    onChange?: (content: string) => void;
    readOnly?: boolean;
}
export declare function CollaborativeEditor({ fileId, content, language, onChange, readOnly, }: CollaborativeEditorProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=CollaborativeEditor.d.ts.map