import toast, { Toaster as HotToaster, ToastBar, ToasterProps } from "react-hot-toast";
import { useApp } from "@/shared/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";
import { selectTheme } from "@/store/slices/uiSlice";

const Toaster = ({ ...props }: Partial<ToasterProps>) => {
  const { isRTL } = useApp();
  const theme = useAppSelector(selectTheme);

  
  return (
    <HotToaster
      position={isRTL ? 'top-left' : 'top-right'}
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        className: '',
        duration: 4000,
        style: {
          background: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#f9fafb' : '#000000',
          border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: 9999,
        },
        // Success toast
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
          style: {
            borderLeft: isRTL ? 'none' : '4px solid #10b981',
            borderRight: isRTL ? '4px solid #10b981' : 'none',
          },
        },
        // Error toast
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
          style: {
            borderLeft: isRTL ? 'none' : '4px solid #ef4444',
            borderRight: isRTL ? '4px solid #ef4444' : 'none',
          },
        },
        // Loading toast
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#ffffff',
          },
        },
        // Custom toast
        custom: {
          duration: 4000,
        },
      }}
      {...props}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              <div 
                style={{ 
                  direction: isRTL ? 'rtl' : 'ltr',
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {message}
              </div>
              {t.type !== 'loading' && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                    cursor: 'pointer',
                    padding: '4px',
                    marginLeft: isRTL ? '0' : '8px',
                    marginRight: isRTL ? '8px' : '0',
                  }}
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </HotToaster>
  );
};

export { Toaster };