// Type declarations for modules without TypeScript definitions

declare module "@ungap/structured-clone" {
  function structuredClone<T>(value: T): T;
  export default structuredClone;
}

declare module "react-native/Libraries/Utilities/PolyfillFunctions" {
  export function polyfillGlobal(name: string, getValue: () => any): void;
}

declare module "web-streams-polyfill" {
  export class ReadableStream<R = any> {
    constructor(
      underlyingSource?: UnderlyingSource<R>,
      strategy?: QueuingStrategy<R>
    );
    readonly locked: boolean;
    cancel(reason?: any): Promise<void>;
    getReader(): ReadableStreamDefaultReader<R>;
    pipeThrough<T>(
      transform: ReadableWritablePair<T, R>,
      options?: StreamPipeOptions
    ): ReadableStream<T>;
    pipeTo(
      destination: WritableStream<R>,
      options?: StreamPipeOptions
    ): Promise<void>;
    tee(): [ReadableStream<R>, ReadableStream<R>];
  }

  export class WritableStream<W = any> {
    constructor(
      underlyingSink?: UnderlyingSink<W>,
      strategy?: QueuingStrategy<W>
    );
    readonly locked: boolean;
    abort(reason?: any): Promise<void>;
    close(): Promise<void>;
    getWriter(): WritableStreamDefaultWriter<W>;
  }

  export class TransformStream<I = any, O = any> {
    constructor(
      transformer?: Transformer<I, O>,
      writableStrategy?: QueuingStrategy<I>,
      readableStrategy?: QueuingStrategy<O>
    );
    readonly readable: ReadableStream<O>;
    readonly writable: WritableStream<I>;
  }
}

// Mood Entry Types
export interface MoodEntry {
  id: number;
  date: string;
  mood: string;
  text: string;
  highlighted: boolean;
}

export interface MoodState {
  entries: MoodEntry[];
  loading: boolean;
  error: string | null;
  filters: {
    keyword: string;
    dateFrom: string;
    dateTo: string;
    selectedMood: string;
  };
}

export interface RootState {
  mood: MoodState;
}
