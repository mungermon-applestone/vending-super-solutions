
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    // Create a local ref to use with useEffect
    const localRef = React.useRef<HTMLTextAreaElement | null>(null);
    
    // Handle the forwarded ref properly
    React.useImperativeHandle(ref, () => localRef.current!);

    // Ensure textarea is always editable
    React.useEffect(() => {
      const textareaElement = localRef.current;
      if (textareaElement) {
        textareaElement.readOnly = false;
        textareaElement.disabled = false;
        textareaElement.removeAttribute('readonly');
        textareaElement.removeAttribute('disabled');
      }
    }, []);
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={localRef}
        readOnly={false}
        disabled={false}
        data-force-editable="true"
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
