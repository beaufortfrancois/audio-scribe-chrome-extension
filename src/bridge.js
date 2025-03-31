// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

window.addEventListener("message", async ({ data }) => {
  try {
    const audioCtx = new AudioContext();
    const audio = await fetch(data.objectUrl);
    const arrayBuffer = await audio.arrayBuffer();
    const content = await audioCtx.decodeAudioData(arrayBuffer);

    const session = await LanguageModel.create({
      expectedInputs: [{ type: "audio" }],
    });
    const stream = session.promptStreaming([
      { type: "audio", content },
      "transcribe this audio",
    ]);
    for await (const chunk of stream) {
      chrome.runtime.sendMessage({ chunk });
    }
    chrome.runtime.sendMessage({ chunk: "$END" });

  } catch (error) {}
});
