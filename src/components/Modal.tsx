// Modal Component
import React from 'react';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Close modal on outside click
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-11/12 rounded-lg bg-white p-4 md:w-3/4 lg:w-2/3"
        ref={modalRef}
      >
        <h2 className="mb-4 text-lg font-bold">Edit Schedule</h2>
        <table className="border-gray-300 min-w-full border-collapse border">
          <thead>
            <tr>
              <th className="border-gray-300 border p-2">家族支援加算</th>
              <th className="border-gray-300 border p-2">医療連携体制加算</th>
              <th className="border-gray-300 border p-2">延長支援加算</th>
              <th className="border-gray-300 border p-2">集中的支援加算</th>
              <th className="border-gray-300 border p-2">
                専門的支援加算（支援実施時）
              </th>
              <th className="border-gray-300 border p-2">通所自立支援加算</th>
              <th className="border-gray-300 border p-2">入浴支援加算</th>
              <th className="border-gray-300 border p-2">子育てサポート加算</th>
              <th className="border-gray-300 border p-2">自立サポート加算</th>
              <th className="border-gray-300 border p-2">保護者等確認欄</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-gray-300 border p-2">
                <input type="text" className="w-full" defaultValue="Data 1" />
              </td>
              <td className="border-gray-300 border p-2">
                <input type="text" className="w-full" defaultValue="Data 2" />
              </td>
              <td className="border-gray-300 border p-2">
                <input type="text" className="w-full" defaultValue="Data 3" />
              </td>
              <td className="border-gray-300 border p-2">
                <input type="text" className="w-full" defaultValue="Data 4" />
              </td>
              <td className="border-gray-300 border p-2">
                <input type="text" className="w-full" defaultValue="Data 5" />
              </td>
              <td className="border-gray-300 border p-2">
                <input type="text" className="w-full" defaultValue="Data 6" />
              </td>
              <td className="border-gray-300 border p-2">
                <input type="text" className="w-full" defaultValue="Data 7" />
              </td>
              <td className="border-gray-300 border p-2">
                <input type="text" className="w-full" defaultValue="Data 8" />
              </td>
              <td className="border-gray-300 border p-2">
                <input type="text" className="w-full" defaultValue="Data 9" />
              </td>
              <td className="border-gray-300 border p-2">
                <input type="text" className="w-full" defaultValue="Data 10" />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
