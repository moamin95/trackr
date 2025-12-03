"use client"
import React from 'react'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function Sonner({children, variant, size, changeTimeHandler}: {children: string, variant: any, size: any, changeTimeHandler: () => void}) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() =>
      {
        changeTimeHandler();
        toast("Time filter updated", {
            description: `Showing ${children} of data`,
          })
      }
      }
    >
      {children}
    </Button>
  )
}
