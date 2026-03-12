import * as React from "react"
import { useMediaQuery } from "@/lib/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function ResponsiveSelect({ value, onValueChange, placeholder, options, label, required }) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Select value={value} onValueChange={onValueChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full justify-start font-normal",
          !value && "text-muted-foreground"
        )}
      >
        {value ? options.find(opt => opt.value === value)?.label : placeholder}
      </Button>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{label || placeholder}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                onValueChange(opt.value)
                setOpen(false)
              }}
              className={cn(
                "flex items-center justify-between w-full p-4 rounded-lg hover:bg-accent transition-colors",
                value === opt.value && "bg-accent"
              )}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check className="w-4 h-4 text-amber-600" />}
            </button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}