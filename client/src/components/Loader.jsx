const Loader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-secondary/60">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent border-r-accent rounded-full animate-spin"></div>
    <span className="mt-4 text-primary font-semibold text-lg font-display">Loading...</span>
  </div>
);
export default Loader;