import { exec } from 'child_process';
import { promisify } from 'util';
import * as vm from 'vm';
import * as fs from 'fs';
import * as path from 'path';
const execAsync = promisify(exec);
const TIMEOUT_MS = 5000;
const MAX_OUTPUT_SIZE = 10000;
export class CodeExecutor {
    async executeJavaScript(code) {
        const startTime = Date.now();
        try {
            const sandbox = {
                console: {
                    log: (...args) => args.map(String).join(' '),
                    error: (...args) => args.map(String).join(' '),
                },
                Math,
                JSON,
                Array,
                Object,
                String,
                Number,
                Boolean,
                Promise,
                Date,
            };
            const script = new vm.Script(code);
            const context = vm.createContext(sandbox);
            let output = '';
            const originalLog = console.log;
            console.log = (...args) => {
                output += args.map(String).join(' ') + '\n';
            };
            try {
                const result = script.runInContext(context, { timeout: TIMEOUT_MS });
                console.log = originalLog;
                if (result !== undefined) {
                    output += String(result);
                }
                return {
                    success: true,
                    output: output.slice(0, MAX_OUTPUT_SIZE),
                    duration: Date.now() - startTime,
                    language: 'javascript',
                };
            }
            catch (err) {
                console.log = originalLog;
                throw err;
            }
        }
        catch (err) {
            return {
                success: false,
                output: '',
                error: err.message || 'Execution failed',
                duration: Date.now() - startTime,
                language: 'javascript',
            };
        }
    }
    async executePython(code) {
        const startTime = Date.now();
        const tempFile = path.join('/tmp', `code_${Date.now()}.py`);
        try {
            // Write code to temp file
            fs.writeFileSync(tempFile, code);
            // Execute with timeout
            const { stdout, stderr } = await execAsync(`timeout ${TIMEOUT_MS / 1000}s python3 "${tempFile}"`, { maxBuffer: MAX_OUTPUT_SIZE });
            const output = stdout || stderr;
            return {
                success: !stderr,
                output: output.slice(0, MAX_OUTPUT_SIZE),
                error: stderr ? stderr.slice(0, MAX_OUTPUT_SIZE) : undefined,
                duration: Date.now() - startTime,
                language: 'python',
            };
        }
        catch (err) {
            return {
                success: false,
                output: err.stdout?.slice(0, MAX_OUTPUT_SIZE) || '',
                error: err.stderr?.slice(0, MAX_OUTPUT_SIZE) || err.message,
                duration: Date.now() - startTime,
                language: 'python',
            };
        }
        finally {
            // Cleanup
            try {
                fs.unlinkSync(tempFile);
            }
            catch (e) {
                // Ignore cleanup errors
            }
        }
    }
    async executeNode(code) {
        const startTime = Date.now();
        const tempFile = path.join('/tmp', `code_${Date.now()}.js`);
        try {
            fs.writeFileSync(tempFile, code);
            const { stdout, stderr } = await execAsync(`timeout ${TIMEOUT_MS / 1000}s node "${tempFile}"`, { maxBuffer: MAX_OUTPUT_SIZE });
            const output = stdout || stderr;
            return {
                success: !stderr,
                output: output.slice(0, MAX_OUTPUT_SIZE),
                error: stderr ? stderr.slice(0, MAX_OUTPUT_SIZE) : undefined,
                duration: Date.now() - startTime,
                language: 'node',
            };
        }
        catch (err) {
            return {
                success: false,
                output: err.stdout?.slice(0, MAX_OUTPUT_SIZE) || '',
                error: err.stderr?.slice(0, MAX_OUTPUT_SIZE) || err.message,
                duration: Date.now() - startTime,
                language: 'node',
            };
        }
        finally {
            try {
                fs.unlinkSync(tempFile);
            }
            catch (e) {
                // Ignore cleanup errors
            }
        }
    }
    async execute(code, language) {
        switch (language.toLowerCase()) {
            case 'javascript':
            case 'js':
                return this.executeJavaScript(code);
            case 'python':
            case 'py':
                return this.executePython(code);
            case 'node':
            case 'nodejs':
                return this.executeNode(code);
            default:
                return {
                    success: false,
                    output: '',
                    error: `Unsupported language: ${language}`,
                    duration: 0,
                    language,
                };
        }
    }
}
export const codeExecutor = new CodeExecutor();
//# sourceMappingURL=CodeExecutor.js.map