// c:/Users/Felipe Florez/Desktop/task-supabase/components/ui/form.tsx
"use client";

import * as React from "react";
import {
  FormProvider,
  useFormContext,
  Controller,
  UseFormReturn,
  FieldValues,
  FieldPath,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn,
  Resolver,
  FieldErrors
} from "react-hook-form";
import type { ZodType } from "zod";

const FormFieldContext = React.createContext<{ name: string } | null>(null);

// ---------------------------------------------------------------------------
// zodResolver – compatible con Zod v4 sin depender de @hookform/resolvers
// ---------------------------------------------------------------------------
export function zodResolver<T extends FieldValues>(
  schema: ZodType<T>
): Resolver<T> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    return {
      values: {},
      errors: result.error.issues.reduce<FieldErrors<T>>(
        (acc, issue) => {
          const key = issue.path[0];
          if (typeof key === "string" && !acc[key as keyof T]) {
            return { ...acc, [key]: { type: issue.code, message: issue.message } };
          }
          return acc;
        },
        {}
      ),
    };
  };
}

// ---------------------------------------------------------------------------
// Form – wrapper that provides the RHF context to its children
// ---------------------------------------------------------------------------
interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** Returned by `useForm()` */
  form: UseFormReturn<any>;
}
export const Form = ({ children, form, ...props }: FormProps) => (
  <FormProvider {...form}>
    <form {...props}>{children}</form>
  </FormProvider>
);

// ---------------------------------------------------------------------------
// FormField – thin wrapper around RHF's Controller
// ---------------------------------------------------------------------------
interface FormFieldProps<TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  name: TName;
  /** Optional override of the control from the context */
  control?: any;
  render: (params: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFieldValues>;
  }) => React.ReactElement;
}
export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  { name, control, render }: FormFieldProps<TFieldValues, TName>
) => {
  const { control: contextControl } = useFormContext<TFieldValues>();
  const finalControl = control ?? contextControl;
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} control={finalControl} render={render} />
    </FormFieldContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// FormItem – container for a single form field (label + input + message)
// ---------------------------------------------------------------------------
export const FormItem = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// FormLabel – label element for the input
// ---------------------------------------------------------------------------
export const FormLabel = ({
  htmlFor,
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label htmlFor={htmlFor} className={className} {...props}>
    {children}
  </label>
);

// ---------------------------------------------------------------------------
// FormControl – wrapper around the actual input component
// ---------------------------------------------------------------------------
export const FormControl = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// FormMessage – shows validation error for a field (or a generic form error)
// ---------------------------------------------------------------------------
interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Optional name of the field whose error should be displayed */
  name?: string;
}
// FormMessage – shows validation error for a field (or a generic form error)
export const FormMessage = ({ name, className, ...props }: FormMessageProps) => {
  const fieldContext = React.useContext(FormFieldContext);
  const fieldName = name || fieldContext?.name;

  let errors: Record<string, any> = {};
  try {
    const { formState } = useFormContext();
    errors = (formState?.errors as any) || {};
  } catch {
    return null;
  }


  const message = fieldName ? (errors as any)?.[fieldName]?.message : undefined;
  if (!message) return null;
  return (
    <p className={`text-[0.8rem] font-medium text-destructive ${className || ""}`} {...props}>
      {String(message)}
    </p>
  );
};
