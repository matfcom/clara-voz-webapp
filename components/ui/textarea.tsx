
export function Textarea({ value, readOnly, placeholder, className }) {
  return (
    <textarea value={value} readOnly={readOnly} placeholder={placeholder}
      className={className + " p-2 border rounded-xl"} rows={4}></textarea>
  );
}
