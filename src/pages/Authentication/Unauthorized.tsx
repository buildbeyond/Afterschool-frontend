import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary">
          アクセス権限がありません
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          このページにアクセスする権限がありません。
        </p>
        <Link
          to="/"
          className="rounded-lg bg-primary px-8 py-3 text-white transition hover:bg-opacity-90"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
