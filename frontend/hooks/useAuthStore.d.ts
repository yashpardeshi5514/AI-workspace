export interface User {
    id: string;
    email: string;
    name: string;
}
export interface AuthStore {
    user: User | null;
    token: string | null;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}
export declare const useAuthStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AuthStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AuthStore, AuthStore>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AuthStore) => void) => () => void;
        onFinishHydration: (fn: (state: AuthStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AuthStore, AuthStore>>;
    };
}>;
//# sourceMappingURL=useAuthStore.d.ts.map