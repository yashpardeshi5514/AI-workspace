// Form validation utilities
export const validators = {
    email: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    password: (password) => {
        if (password.length < 8)
            return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(password))
            return 'Password must contain an uppercase letter';
        if (!/[a-z]/.test(password))
            return 'Password must contain a lowercase letter';
        if (!/[0-9]/.test(password))
            return 'Password must contain a number';
        return null;
    },
    filename: (name) => {
        if (!name.trim())
            return 'Name cannot be empty';
        if (name.length > 255)
            return 'Name is too long';
        if (/[<>:"/\\|?*]/.test(name))
            return 'Name contains invalid characters';
        return null;
    },
    workspaceName: (name) => {
        if (!name.trim())
            return 'Workspace name is required';
        if (name.length < 3)
            return 'Name must be at least 3 characters';
        if (name.length > 100)
            return 'Name is too long';
        return null;
    },
    chatMessage: (message) => {
        if (!message.trim())
            return 'Message cannot be empty';
        if (message.length > 10000)
            return 'Message is too long';
        return null;
    },
};
export const validateForm = (data, rules) => {
    const errors = [];
    for (const [field, validator] of Object.entries(rules)) {
        const error = validator(data[field]);
        if (error) {
            errors.push({ field, message: error });
        }
    }
    return errors;
};
//# sourceMappingURL=validation.js.map