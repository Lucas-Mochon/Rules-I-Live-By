export type NestedKeyOf<T> = {
    [K in keyof T & string]: T[K] extends Record<string, unknown>
        ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
        : `${K}`;
}[keyof T & string];
