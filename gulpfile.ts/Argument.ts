const argv = require("minimist")(process.argv.slice(2))

export class Argument {
    static requiredString(key: string): string {
        const value = this.optionalString(key)
        if (!value) {
            throw new Error(`Required command-line argument \`${key}\` is missing`)
        }
        return value
    }

    static optionalString(key: string, defaultValue?: string): string {
        return argv[key] || defaultValue;
    }

    static optionalStringArray(key: string, defaultValue?: string[]): string[] {
        return argv[key] || defaultValue;
    }
}
