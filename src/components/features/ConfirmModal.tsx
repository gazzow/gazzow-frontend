export default function ConfirmModal() {
  return (
    <div className="fixed inset-0 bg-primary/60  flex justify-center items-center">
      <div className="bg-white dark:bg-secondary p-4 rounded shadow flex flex-col">
        <p className="font-bold text-black dark:text-white">
          {"condition" === "condition"
            ? "Are you sure you want to block this user?"
            : "Are you sure you want to activate this user?"}
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            className="bg-red-400 text-white py-1 px-4 rounded cursor-pointer"
            // onClick={() => setConfirmModalOpen(false)}
          >
            No
          </button>
          <button
            className="bg-green-400 py-1 px-4 rounded text-gray cursor-pointer"
            // onClick={confirmToggleStatus}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
