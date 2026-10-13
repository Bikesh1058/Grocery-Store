const Loader = ({ fullScreen = false }) => {
  const wrapper = fullScreen
    ? "flex items-center justify-center min-h-[60vh]"
    : "flex items-center justify-center py-10";
  return (
    <div className={wrapper}>
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader; 