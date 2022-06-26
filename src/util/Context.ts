import { IConstruct } from "constructs";

export class Context {
    public static requiredString(construct: IConstruct, key: string): string {
        const value = this.optionalString(construct, key)
        if (!value) {
            throw new Error(`Required context string not found for \`${key}\``);
        }
        return value
    }

    public static optionalString(construct: IConstruct, key: string): string | undefined {
        return construct.node.tryGetContext(key);
    }
}