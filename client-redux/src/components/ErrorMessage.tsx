interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  return (
    <div className="error-banner" role="alert">
      <strong>Помилка:</strong> {message}
    </div>
  );
};
