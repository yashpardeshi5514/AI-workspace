export declare function useAuth(): {
    register: (email: string, name: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: any;
    error: string;
    loading: boolean;
};
//# sourceMappingURL=useAuth.d.ts.map