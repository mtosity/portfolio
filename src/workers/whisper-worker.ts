/// <reference lib="webworker" />

import { pipeline, type PipelineType } from "@huggingface/transformers";

type InitMsg = {
  type: "init";
  model: string;
  dtype: unknown;
  device: "wasm" | "webgpu" | "cpu" | "auto";
};

type TranscribeMsg = {
  type: "transcribe";
  audio: Float32Array;
  options?: {
    chunk_length_s?: number;
    stride_length_s?: number;
    return_timestamps?: boolean;
  };
};

type InMsg = InitMsg | TranscribeMsg;

type Transcriber = (
  input: Float32Array,
  opts?: TranscribeMsg["options"],
) => Promise<{ text: string; chunks?: unknown[] }>;

let transcriber: Transcriber | null = null;

self.addEventListener("message", async (e: MessageEvent<InMsg>) => {
  const msg = e.data;
  try {
    if (msg.type === "init") {
      transcriber = (await pipeline(
        "automatic-speech-recognition" as PipelineType,
        msg.model,
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dtype: msg.dtype as any,
          device: msg.device,
          progress_callback: (p: {
            status: string;
            loaded?: number;
            total?: number;
            progress?: number;
            file?: string;
          }) => {
            self.postMessage({ type: "progress", payload: p });
          },
        },
      )) as unknown as Transcriber;
      self.postMessage({ type: "ready" });
      return;
    }

    if (msg.type === "transcribe") {
      if (!transcriber) {
        self.postMessage({ type: "error", message: "Model not loaded" });
        return;
      }
      const result = await transcriber(msg.audio, msg.options);
      self.postMessage({ type: "result", payload: result });
      return;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({ type: "error", message });
  }
});
