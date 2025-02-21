// function to check for language
export const detectLanguage = async () => {
  if (!self.ai || !self.ai.languageDetector) {
    console.error("AI Language Detector API is not supported in this browser");
    return null;
  }

  const languageDetectorCapabilities =
    await self.ai.languageDetector.capabilities();
  const canDetect = languageDetectorCapabilities.capabilities;

  let detector;

  if (canDetect === "no") {
    // The language detector isn't usable.
    return;
  }
  if (canDetect === "readily") {
    // The language detector can immediately be used.
    detector = await self.ai.languageDetector.create();
  } else {
    // The language detector can be used after model download.
    detector = await self.ai.languageDetector.create({
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
        });
      },
    });
    await detector.ready;
  }
  return detector;
};

// export const initializeChromeAI = async (setLoading) => {
//   if (!self.ai || !self.ai.languageDetector || !self.ai.translator) {
//     console.error("Chrome AI API is not available in this browser.");
//     return { detector: null, translator: null };
//   }

//   setLoading(true); // Show loading spinner

//   // Initialize the language detector
//   const languageDetectorCapabilities =
//     await self.ai.languageDetector.capabilities();
//   const canDetect = languageDetectorCapabilities.capabilities;

//   if (canDetect === "no") {
//     console.error("Language detection is not available.");
//     setLoading(false);
//     return { detector: null, translator: null };
//   }

//   let detector;

//   if (canDetect === "readily") {
//     detector = await self.ai.languageDetector.create();
//   } else {
//     detector = await self.ai.languageDetector.create({
//       monitor(m) {
//         m.addEventListener("downloadprogress", (e) => {
//           console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
//         });
//       },
//     });
//     await detector.ready;
//   }

//   // Initialize AI Translator
//   const translator = await self.ai.translator.create();

//   setLoading(false); // Hide loading spinner

//   return { detector, translator };
// };
