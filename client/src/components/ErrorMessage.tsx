interface ErrorLike {
  message: string;
  code?: string;
}

interface ErrorMessageProps {
  error: ErrorLike | null;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;
  return (
    <div className="error-banner" role="alert">
      <strong>Помилка:</strong> {error.message}
    </div>
  );
};
