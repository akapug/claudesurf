/**
 * Hook Installation - Copies ClaudeSurf hooks to project
 */
export interface InstallOptions {
    targetDir?: string;
    force?: boolean;
    glue?: boolean;
}
export declare function installHooks(options?: InstallOptions): void;
export declare function uninstallHooks(options?: InstallOptions): void;
//# sourceMappingURL=install-hooks.d.ts.map