const argv = require("minimist")(process.argv.slice(2))

// Use to resolve command line arguments
// For example, user executes `gulp deploy --env=dev`
// const environment = Argument.requiredString("env") // returns dev
// const label = Argument.optionalString("label")     // returns undefined
// const name = Argument.requiredString("name")       // throws exception Required command-line argument ...
export class Argument {
    static requiredString(key: string): string {
        const value = this.optionalString(key)
        if (!value) {
            throw new Error(`Required command-line argument \`${key}\` is missing`)
        }
        return value
    }

    static optionalString(key: string, defaultValue: string | undefined | null = undefined): string {
        return argv[key] || defaultValue;
    }

    static optionalStringArray(key: string, defaultValue?: string[]): string[] {
        return argv[key] || defaultValue;
    }
}
