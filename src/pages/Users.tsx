import { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import { authApi, scheduleApi } from '../services/api';
import DefaultUser from '../images/user/default.png';
import { Parent } from '../components/Sidebar';

const Users = () => {
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Parent[]>([]);
  const handleClick = (userId: string) => {
    setSelectedId(userId);
  };
  const handleDeleteUser = async () => {
    const userId = selectedId;
    setSelectedId('');
    setLoading(true);
    try {
      const response = await authApi.deleteUser(userId);
      setUsers(users.filter(({ _id }) => _id !== userId));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    scheduleApi
      .fetchAllParents()
      .then((response) => {
        setUsers(response.parents);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="ユーザー管理" />
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-gray-300 border-y">
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">名前</th>
              <th className="px-4 py-2">保護者の名前</th>
              <th className="px-4 py-2">メールアドレス</th>
            </tr>
          </thead>
          {!loading && (
            <tbody className="divide-gray-200 divide-y">
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <img
                      src={user.avatar ? user.avatar : DefaultUser}
                      className="h-10 w-10 rounded-full"
                    />
                  </td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.guardianName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleClick(user._id)}>削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {loading && (
          <div className="w-full py-10 text-center">読み込み中...</div>
        )}
      </div>
      {selectedId && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedId('');
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-lg border border-stroke bg-white shadow-xl dark:border-strokedark dark:bg-boxdark dark:text-bodydark"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-end">
                {/* <h3 className="text-lg font-medium">選択</h3> */}
                <button
                  onClick={() => setSelectedId('')}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-4">
              <div className="space-y-3 text-center">本当に実行しますか？</div>
            </div>

            <div className="flex justify-center gap-x-10 p-4">
              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleDeleteUser}
              >
                はい
              </button>
              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => setSelectedId('')}
              >
                いいえ
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};
export default Users;
