import { Suspense } from "react";
import LoadingSpinner from "../_components/LoadingSpinner";
import SheetDataWrapper from "../_components/sheet-data-viewer/SheetDataWrapper";

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SheetDataWrapper />
    </Suspense>
  );
}
