// Shared utilities
export function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=index.js.map