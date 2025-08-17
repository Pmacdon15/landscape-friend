// import { Client } from "@/types/types-clients";
// import { UseMutationResult } from "@tanstack/react-query";

// export function backButton(setView: React.Dispatch<React.SetStateAction<string>>) {
//   setView("list");
// }

// export async function saveDrawing(
//   drawingManagerRef: React.MutableRefObject<google.maps.drawing.DrawingManager | null>,
//   client: Client,
//   mutate: UseMutationResult<{ success: boolean; message: string; status: number; } | { error: string; status: number; } | Error | null, Error, { file: Blob; clientId: number; }, unknown>['mutate']
// ) {
//   // Attempting to re-trigger TypeScript type checking
//   const container = document.getElementById("map-container");
//   if (!container) return;

//   const drawingManager = drawingManagerRef.current;
//   if (!drawingManager) {
//     console.error("DrawingManager is not initialized.");
//     return;
//   }

//   // Hide Drawing Manager controls
//   drawingManager.setOptions({ drawingControl: false });

//   // ✅ Wait for DOM to update visually
//   await new Promise<void>((resolve) => {
//     requestAnimationFrame(() => {
//       setTimeout(resolve, 100); // 100ms delay to ensure visual update
//     });
//   });

//   try {
//     const html2canvasFn = (await import("html2canvas-pro")).default;
//     const canvas = await html2canvasFn(container, {
//       useCORS: true,
//       allowTaint: false,
//     });

//     canvas.toBlob(async (blob) => {
//       if (!blob) {
//         console.error("Blob creation failed.");
//         drawingManager.setOptions({ drawingControl: true });
//         return;
//       }

//       try {
//         mutate({ file: blob, clientId: client.id });
//       } catch (uploadError) {
//         console.error("Upload failed:", uploadError);
//       } finally {
//         drawingManager.setOptions({ drawingControl: true });
//       }
//     }, "image/png");
//   } catch (err) {
//     console.error("Canvas capture failed:", err);
//     drawingManager.setOptions({ drawingControl: true });
//   }
// }