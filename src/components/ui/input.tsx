
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Add logging for debugging input events
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('[Input] onChange event:', e.target.value);
      // Make sure we're calling the original onChange handler if one was provided
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        onChange={handleOnChange}
        {...props}
        onFocus={(e) => {
          console.log('[Input] Focus event on field:', e.target.name || 'unnamed', 'Value:', e.target.value);
          if (props.onFocus) {
            props.onFocus(e);
          }
        }}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
