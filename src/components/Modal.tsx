interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0  flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow">
        {children}
        <button onClick={onClose}>Close</button>
      </div>    
    </div>
  );
};

export default Modal;
