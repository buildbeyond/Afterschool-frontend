import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
  };
  receiver: {
    _id: string;
    username: string;
  };
  createdAt: string;
  read: boolean;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [parents, setParents] = useState<User[]>([]);
  const [selectedParent, setSelectedParent] = useState<User | null>(null);
  const [coach, setCoach] = useState<User | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch coach info (for parents)
  useEffect(() => {
    if (user?.role === 'parent') {
      const fetchCoach = async () => {
        try {
          const response = await axios.get('/api/messages/coach');
          setCoach(response.data.coach);
        } catch (error) {
          console.error('Error fetching coach:', error);
        }
      };
      fetchCoach();
    }
  }, [user?.role]);

  // Fetch parent list (for coach)
  useEffect(() => {
    if (user?.role === 'coach') {
      const fetchParents = async () => {
        try {
          const response = await axios.get('/api/messages/parents');
          setParents(response.data);
        } catch (error) {
          console.error('Error fetching parents:', error);
        }
      };
      fetchParents();
    }
  }, [user?.role]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      const otherUser = user?.role === 'coach' ? selectedParent : coach;
      if (!otherUser) return;

      try {
        const response = await axios.get(`/api/messages/${otherUser._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [user?.role, selectedParent, coach]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const otherUser = user?.role === 'coach' ? selectedParent : coach;
    if (!newMessage.trim() || !otherUser) return;

    try {
      const response = await axios.post('/api/messages', {
        receiver: otherUser._id,
        content: newMessage.trim(),
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          メッセージ
        </h2>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Parent List (Only for Coach) */}
        {user?.role === 'coach' && (
          <div className="w-72 border-r border-stroke dark:border-strokedark">
            <div className="border-b border-stroke p-4 dark:border-strokedark">
              <h2 className="text-xl font-semibold">保護者一覧</h2>
            </div>
            <div className="h-full overflow-y-auto">
              {parents.map((parent) => (
                <button
                  key={parent._id}
                  onClick={() => setSelectedParent(parent)}
                  className={`w-full p-4 text-left hover:bg-gray-2 dark:hover:bg-meta-4 ${
                    selectedParent?._id === parent._id
                      ? 'bg-gray-2 dark:bg-meta-4'
                      : ''
                  }`}
                >
                  <p className="font-medium">{parent.username}</p>
                  <p className="text-gray-6 text-sm">{parent.email}</p>
                </button>
              ))}
              {parents.length === 0 && (
                <p className="text-gray-6 p-4">メッセージはありません。</p>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          {(user?.role === 'coach' && selectedParent) ||
          (user?.role === 'parent' && coach) ? (
            <>
              <div className="border-b border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
                <h2 className="text-xl font-semibold">
                  {user?.role === 'coach'
                    ? selectedParent?.username
                    : coach?.username}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`mb-4 flex ${
                      message.sender._id === user?._id
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender._id === user?._id
                          ? 'bg-primary text-white'
                          : 'bg-gray-2 dark:bg-meta-4'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="メッセージを入力..."
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="flex justify-center rounded bg-primary px-6 py-3 font-medium text-gray hover:shadow-1"
                    disabled={!newMessage.trim()}
                  >
                    送信
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-gray-6 flex h-full items-center justify-center">
              {user?.role === 'coach'
                ? '左のリストから保護者を選択してください。'
                : '管理者が見つかりません。'}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messages;
