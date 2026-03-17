"use client";

import { useEffect, useState } from "react";
import { ARProp } from "@/lib/ar/types";
import { AR_PROPS, loadARProps } from "@/public/ar-props";

export function useARProps() {
  const [arProps, setArProps] = useState<ARProp[]>(AR_PROPS);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const props = await loadARProps();
      if (isMounted) {
        setArProps(props);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return arProps;
}
