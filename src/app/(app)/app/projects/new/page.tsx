"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app/projects?create=1");
  }, [router]);

  return null;
}
