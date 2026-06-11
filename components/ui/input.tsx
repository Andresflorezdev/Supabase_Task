import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    // Determinar el tipo de input a mostrar
    const inputType = type === "password" && showPassword ? "text" : type

    return (
      <div className="relative w-full">
        <input
          type={inputType}
          className={cn(
            "flex h-10 bg-background w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-purple-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            type === "password" ? "pr-10" : "",
            className
          )}
          style={{ paddingLeft: '1.1rem' }}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            tabIndex={-1}
            style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', border: 'none', background: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            className="text-muted-foreground hover:text-foreground"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }