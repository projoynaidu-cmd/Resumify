"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { useUIStore } from "@/store";
import { ResumePreview } from "./ResumePreview";
import { CoverLetterPreview } from "./CoverLetterPreview";
import { PreviewToolbar } from "./PreviewToolbar";

export function PreviewViewport() {
  const activeView = useUIStore((s) => s.activeView);

  return (
    <div className="relative flex w-full justify-center overflow-hidden">
      <TransformWrapper
        initialScale={0.8}
        minScale={0.4}
        maxScale={2}
        centerOnInit
        limitToBounds={false}
        smooth
        wheel={{
          step: 0.08,
        }}
        pinch={{
          step: 5,
        }}
        panning={{
          disabled: false,
        }}
        doubleClick={{
          disabled: true,
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <PreviewToolbar
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              resetTransform={resetTransform}
            />

            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="flex justify-center items-start py-6"
            >
              {activeView === "resume" ? (
                <div
                  id="resume-wrapper"
                  className="w-[794px] rounded bg-white shadow-[var(--shadow-lg)]"
                >
                  <ResumePreview />
                </div>
              ) : (
                <div className="rounded bg-white shadow-[var(--shadow-lg)]">
                  <CoverLetterPreview />
                </div>
              )}
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}