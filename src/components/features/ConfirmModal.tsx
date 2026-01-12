interface ConfirmModal {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onConfirm?: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onCancel,
  onConfirm,
}: ConfirmModal) {
  return (
    <div className="fixed inset-0 bg-primary/60  flex justify-center items-center">
      <div className="bg-white dark:bg-secondary p-4 rounded justify-center items-center shadow flex flex-col gap-3">
        <h2 className="text-xl font-medium text-black dark:text-white">{title}</h2>
        <p className="font-semibold text-black dark:text-white">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-red-400 text-white py-1 px-4 rounded cursor-pointer hover:bg-red-500"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="bg-green-400 py-1 px-4 rounded text-gray-950 cursor-pointer hover:bg-green-500"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
