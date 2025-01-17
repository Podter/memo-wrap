export type Awaitable<T> = PromiseLike<T> | T;

export type Callback = (...args: any[]) => Awaitable<any>;
