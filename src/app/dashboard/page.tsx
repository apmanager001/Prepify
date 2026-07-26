import { Suspense } from "react";
import DashboardClient from "./comp/DashboardClient";
import LoadingComp from "@/lib/loading";

export default function Page() {
  return (
    <Suspense fallback={<LoadingComp/>}>
      <DashboardClient />
    </Suspense>
  );
}
