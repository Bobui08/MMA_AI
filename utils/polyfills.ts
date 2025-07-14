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

    if (!("structuredClone" in global)) {
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);

    if (!("ReadableStream" in global)) {
      const { ReadableStream } = await import("web-streams-polyfill");
      polyfillGlobal("ReadableStream", () => ReadableStream);
    }

    if (!("TransformStream" in global)) {
      const { TransformStream } = await import("web-streams-polyfill");
      polyfillGlobal("TransformStream", () => TransformStream);
    }

    if (!("WritableStream" in global)) {
      const { WritableStream } = await import("web-streams-polyfill");
      polyfillGlobal("WritableStream", () => WritableStream);
    }
  };

  setupPolyfills().catch(console.error);
}

export {};
