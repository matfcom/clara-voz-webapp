import * as React from "react";

export function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className="w-full p-2 border rounded" {...props} />
  );
}