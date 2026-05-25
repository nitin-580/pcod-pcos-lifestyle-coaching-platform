declare module 'next/navigation' {
  export function useRouter(): {
    push(url: string, options?: any): void;
    replace(url: string, options?: any): void;
    prefetch(url: string, options?: any): void;
    back(): void;
    forward(): void;
    refresh(): void;
  };
  export function usePathname(): string;
  export function useSearchParams(): {
    get(name: string): string | null;
    getAll(name: string): string[];
    has(name: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    entries(): IterableIterator<[string, string]>;
    toString(): string;
  };
  export function useParams<T = any>(): T;
}
