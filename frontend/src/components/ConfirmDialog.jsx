import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * Bootstrap-based confirmation dialog modal.
 * @param {boolean}  show       - Controls visibility
 * @param {string}   title      - Modal title
 * @param {string}   message    - Confirmation message
 * @param {Function} onConfirm  - Called when user confirms
 * @param {Function} onCancel   - Called when user cancels
 * @param {boolean}  isLoading  - Shows spinner on confirm button
 */
function ConfirmDialog({ show, title = 'Confirm Action', message, onConfirm, onCancel, isLoading }) {
  const dialogRef = useRef(null);

  // Trap focus inside modal when shown
  useEffect(() => {
    if (show && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="confirm-dialog" ref={dialogRef} tabIndex={-1}>
        <div className="confirm-dialog__header">
          <div className="confirm-dialog__icon">
            <AlertTriangle size={24} />
          </div>
          <h5 className="confirm-dialog__title">{title}</h5>
        </div>

        <p className="confirm-dialog__message">{message}</p>

        <div className="confirm-dialog__actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Deleting...
              </>
            ) : (
              'Yes, Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
