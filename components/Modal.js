import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ onClose, children, title }) => {
   const handleCloseClick = (e) => {
      e.preventDefault();
      onClose();
   }

   const modalContent = (
      <div className="modal-overlay">
          <div className="modal-wrapper">
              <div className="modal">
                  <div className="modal-header">
                      <a href="#" class="text-gray-500" onClick={handleCloseClick}>
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                           <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                           </svg>
                      </a>
                  </div>
                  {title && <h1>{title}</h1>}
                  <div className="h-full modal-body">{children}</div>
              </div>
          </div>
      </div>
  );
  return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal-root")
   );
};

export default Modal