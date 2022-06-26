import { Nullable } from "../types";

export class Naming {
    readonly environment: string;
    readonly baseName: string;
    readonly label?: Nullable<string>;
    readonly namespace: string;

    public constructor(params: {
        env: string,
        baseName: string,
        label?: Nullable<string>
    }) {
        this.environment = params.env;
        this.baseName = params.baseName;
        this.label = params.label || undefined;
        this.namespace = (!params.label) ? params.env : `${params.env}-${params.label}`;
    }

    public prefixWithEnvironment(baseString: string, separator: string = "-"): string {
        return `${this.environment}${separator}${baseString}`.toLowerCase();
    }

    public prefixWithNamespace(baseString: string, separator: string = "-"): string {
        return `${this.namespace}${separator}${baseString}`.toLowerCase();
    }

    public prefixWithModuleName(baseString: string, separator: string = "-"): string {
        return `${this.baseName}${separator}${baseString}`.toLowerCase();
    }

    public prefixWithEnvironmentModuleName(baseString: string, separator: string = "-"): string {
        return this.prefixWithEnvironment(this.prefixWithModuleName(baseString, separator));
    }

    public prefixWithNamespaceModuleName(baseString: string, separator: string = "-"): string {
        return this.prefixWithNamespace(this.prefixWithModuleName(baseString, separator));
    }
}

