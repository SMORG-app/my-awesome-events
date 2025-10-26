import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const valueArray = props.value || props.defaultValue || [0];
  const isRange = Array.isArray(valueArray) && valueArray.length > 1;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center group", className)}
      {...props}
    >
      <SliderPrimitive.Track 
        className="relative h-2 w-full grow overflow-hidden rounded-full transition-colors duration-200"
        style={{ backgroundColor: '#E8E2D8' }}
      >
        <SliderPrimitive.Range 
          className="absolute h-full transition-all duration-200 ease-in-out"
          style={{ 
            backgroundColor: '#6C3C65',
          }}
        />
      </SliderPrimitive.Track>
      {isRange ? (
        <>
          <SliderPrimitive.Thumb 
            className="block h-4 w-4 rounded-full bg-white border transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            style={{ 
              borderColor: '#6C3C65',
              borderWidth: '1px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
            }}
            aria-label="minimum price"
          />
          <SliderPrimitive.Thumb 
            className="block h-4 w-4 rounded-full bg-white border transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
            style={{ 
              borderColor: '#6C3C65',
              borderWidth: '1px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
            }}
            aria-label="maximum price"
          />
        </>
      ) : (
        <SliderPrimitive.Thumb 
          className="block h-4 w-4 rounded-full bg-white border transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          style={{ 
            borderColor: '#6C3C65',
            borderWidth: '1px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
          }}
          aria-label="slider thumb"
        />
      )}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
