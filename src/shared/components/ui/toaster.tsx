import toast, { Toaster as HotToaster, ToastBar, ToasterProps } from "react-hot-toast";
import { useApp } from "@/shared/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";
import { selectTheme } from "@/store/slices/uiSlice";
import { useEffect } from "react";

const Toaster = ({ ...props }: Partial<ToasterProps>) => {
  const { isRTL } = useApp();
  const theme = useAppSelector(selectTheme);

  // Update toast container direction when RTL changes
  useEffect(() => {
    const updateToastDirection = () => {
      const toastContainer = document.querySelector('.react-hot-toast') as HTMLElement;
      if (toastContainer) {
        toastContainer.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        toastContainer.style.direction = isRTL ? 'rtl' : 'ltr';
        
        // Update all toast divs inside for proper text direction
        const toastDivs = toastContainer.querySelectorAll('div');
        toastDivs.forEach((div) => {
          div.style.direction = isRTL ? 'rtl' : 'ltr';
        });
      }
    };

    // Update immediately
    updateToastDirection();

    // Also update after a short delay to catch dynamically created containers
    const timeoutId = setTimeout(updateToastDirection, 100);

    // Watch for new toast containers being added
    const observer = new MutationObserver(() => {
      updateToastDirection();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [isRTL]);

  
  return (
    <HotToaster
        key={isRTL ? 'rtl-toaster' : 'ltr-toaster'}
        position='top-right'
        reverseOrder={false}
        gutter={8}
        containerClassName={isRTL ? 'rtl-toast-container' : 'rtl-toast-container'}
        containerStyle={{
          direction: isRTL ? 'rtl' : 'ltr',
          right: '1rem',
          left: 'auto',
        }}
        toastOptions={{
          // Default options for all toasts
          className: isRTL ? 'rtl-toast' : '',
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
            direction: isRTL ? 'rtl' : 'ltr',
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
          <ToastBar 
            toast={t}
            style={{
              direction: isRTL ? 'rtl' : 'ltr',
            }}
          >
            {({ icon, message }) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
              >
                {icon && (
                  <div 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                )}
                <div 
                  style={{ 
                    flex: 1,
                    direction: isRTL ? 'rtl' : 'ltr',
                    textAlign: isRTL ? 'right' : 'left',
                    minWidth: 0,
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginLeft: isRTL ? '0' : 'auto',
                      marginRight: isRTL ? 'auto' : '0',
                    }}
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </ToastBar>
        )}
      </HotToaster>
  );
};

export { Toaster };