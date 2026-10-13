const Message = ({ variant = "info", children }) => {
  const colors = {
    info: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return (
    <div className={`border px-4 py-3 rounded-lg text-sm ${colors[variant]}`}>
      {children}
    </div>
  );
};

export default Message;