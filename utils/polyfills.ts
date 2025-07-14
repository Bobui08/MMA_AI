import structuredClone from "@ungap/structured-clone";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import(
      "react-native/Libraries/Utilities/PolyfillFunctions"
    );

    const { TextEncoderStream, TextDecoderStream } = await import(
      "@stardazed/streams-text-encoding"
    );

    // Polyfill structuredClone
    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    // Polyfill streaming text encoding
    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);

    // Polyfill ReadableStream if not available
    if (!("ReadableStream" in global)) {
      const { ReadableStream } = await import("web-streams-polyfill");
      polyfillGlobal("ReadableStream", () => ReadableStream);
    }

    // Polyfill TransformStream if not available
    if (!("TransformStream" in global)) {
      const { TransformStream } = await import("web-streams-polyfill");
      polyfillGlobal("TransformStream", () => TransformStream);
    }

    // Polyfill WritableStream if not available
    if (!("WritableStream" in global)) {
      const { WritableStream } = await import("web-streams-polyfill");
      polyfillGlobal("WritableStream", () => WritableStream);
    }
  };

  setupPolyfills().catch(console.error);
}

export {};
