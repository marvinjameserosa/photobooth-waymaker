"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GridResultsElevatorRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/grid-results");
  }, [router]);

  return null;
}
