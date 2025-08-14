import * as React from "react";
import { useFormContext, FieldPath, FieldValues } from "react-hook-form";

// These types must match the ones in form.tsx
export type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
  name: TName;
};

export type FormItemContextValue = {
  id: string;
};

export function useFormField() {
  // These contexts must be provided by the main form.tsx file
  const fieldContext = React.useContext<unknown>(null) as { name: string } | null;
  const itemContext = React.useContext<unknown>(null) as { id: string } | null;
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext?.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext || {};

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
} 