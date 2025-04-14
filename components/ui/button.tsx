
export function Button({ onClick, disabled, children, className }) {
  return (
    <button onClick={onClick} disabled={disabled} className={className + " bg-blue-600 text-white rounded-xl"}>
      {children}
    </button>
  );
}
