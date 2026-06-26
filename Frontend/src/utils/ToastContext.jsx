import { createContext, useContext, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    setToast(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showToast = useCallback(({ message, actionLabel, actionPath, duration = 3000 }) => {
  console.log("showToast called with:", message); // 👈 add this
  if (timerRef.current) clearTimeout(timerRef.current);
  setToast({ message, actionLabel, actionPath });
  timerRef.current = setTimeout(() => setToast(null), duration);
}, []);
  const handleAction = () => {
    if (toast?.actionPath) navigate(toast.actionPath);
    hideToast();
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-gray-900 text-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-3">
          <CheckCircle2 size={18} className="text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toast.message}</span>

          {toast.actionLabel && (
            <button
              onClick={handleAction}
              className="text-sm font-semibold text-teal-400 hover:text-teal-300 underline ml-1"
            >
              {toast.actionLabel}
            </button>
          )}

          <button onClick={hideToast} className="ml-2 text-gray-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
};