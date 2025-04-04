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

chrome.runtime.onMessage.addListener(async ({ data }) => {
  try {
    const audio = await fetch(data.objectUrl);
    const content = await audio.blob();

    const session = await LanguageModel.create({
      expectedInputs: [{ type: "audio" }],
    });
    const stream = session.promptStreaming([
      { type: "audio", content },
      "transcribe this audio",
    ]);
    for await (const chunk of stream) {
      div.append(chunk);
    }
    div.append(document.createElement("hr"));

  } catch (error) {}
});