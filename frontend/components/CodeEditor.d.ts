interface CodeEditorProps {
    filename: string;
    content: string;
    onChange?: (content: string) => void;
    readOnly?: boolean;
}
export declare function CodeEditor({ filename, content, onChange, readOnly, }: CodeEditorProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=CodeEditor.d.ts.map