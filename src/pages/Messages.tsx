import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import useColorMode from '../hooks/useColorMode';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
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
  const [colorMode] = useColorMode();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [parents, setParents] = useState<User[]>([]);
  const [selectedParent, setSelectedParent] = useState<User | null>(null);
  const [coach, setCoach] = useState<User | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const height = container.clientHeight;
      const maxScroll = scrollHeight - height;

      // Add smooth scrolling class
      container.style.scrollBehavior = 'smooth';
      container.scrollTop = maxScroll;

      // Reset scroll behavior after animation
      setTimeout(() => {
        container.style.scrollBehavior = 'auto';
      }, 300);
    }
  };

  // Scroll to bottom whenever messages change or user is selected
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedParent, coach, showChat]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1280) {
        setShowChat(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io('', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Authenticate with token
    const token = Cookies.get('token');
    if (token) {
      console.log('Authenticating socket with token');
      socketRef.current.emit('authenticate', token);
    }

    // Handle authentication success
    socketRef.current.on('authenticated', () => {
      console.log('Socket authenticated successfully');
    });

    // Handle authentication error
    socketRef.current.on('auth_error', (error) => {
      console.error('Socket authentication error:', error);
    });

    // Handle connection events
    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      // Re-authenticate on reconnection
      if (token) {
        socketRef.current?.emit('authenticate', token);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Listen for new messages
    socketRef.current.on('new_message', (message: Message) => {
      console.log('New message received:', message);
      const otherUser = user?.role === 'coach' ? selectedParent : coach;

      if (
        otherUser &&
        ((message.sender._id === otherUser._id &&
          message.receiver._id === user?._id) ||
          (message.sender._id === user?._id &&
            message.receiver._id === otherUser._id))
      ) {
        console.log('Adding message to chat');
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      // Update last message in parent list if needed
      if (user?.role === 'coach') {
        setParents((prevParents) =>
          prevParents.map((parent) =>
            parent._id === message.sender._id ||
            parent._id === message.receiver._id
              ? {
                  ...parent,
                  lastMessage: {
                    content: message.content,
                    createdAt: message.createdAt,
                  },
                }
              : parent
          )
        );
      }
    });

    // Handle message errors
    socketRef.current.on('message_error', (error) => {
      console.error('Message sending error:', error);
    });

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up socket connection');
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, selectedParent, coach]);

  // Fetch coach info (for parents)
  useEffect(() => {
    if (user?.role === 'parent') {
      const fetchCoach = async () => {
        try {
          const response = await api.get('/messages/coach');
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
          const response = await api.get('/messages/parents');
          setParents(response.data);
        } catch (error) {
          console.error('Error fetching parents:', error);
        }
      };
      fetchParents();
    }
  }, [user?.role]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      const otherUser = user?.role === 'coach' ? selectedParent : coach;
      if (!otherUser) return;

      try {
        const response = await api.get(`/messages/${otherUser._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [user?.role, selectedParent, coach]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const otherUser = user?.role === 'coach' ? selectedParent : coach;
    if (!newMessage.trim() || !otherUser || !socketRef.current) return;

    try {
      // Send message through Socket.IO
      socketRef.current.emit('send_message', {
        sender: user._id,
        receiver: otherUser._id,
        content: newMessage.trim(),
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleParentSelect = (parent: User) => {
    setSelectedParent(parent);
    setShowChat(true);
    // Force scroll after state updates
    setTimeout(scrollToBottom, 150);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="メッセージ" />

      <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
        <div
          className={`h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex`}
        >
          {/* Chat List Section */}
          {user?.role === 'coach' && (!showChat || windowWidth >= 1280) && (
            <div
              className={`h-full flex-col ${
                showChat ? 'hidden xl:flex xl:w-1/4' : 'flex w-full xl:w-1/4'
              }`}
            >
              <div className="sticky border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                <h3 className="text-lg font-medium text-black dark:text-white 2xl:text-xl">
                  保護者一覧
                </h3>
              </div>
              <div className="flex max-h-full flex-col overflow-auto p-5">
                <div className="scrollbar scrollbar-track-gray-200 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 dark:scrollbar-track-boxdark-2 dark:scrollbar-thumb-boxdark-1 max-h-full space-y-2.5 overflow-y-auto">
                  {parents.map((parent) => (
                    <div
                      key={parent._id}
                      onClick={() => handleParentSelect(parent)}
                      className={`flex cursor-pointer items-center rounded px-4 py-2 hover:bg-gray-2 dark:hover:bg-strokedark ${
                        selectedParent?._id === parent._id
                          ? 'bg-gray-2 dark:bg-strokedark'
                          : ''
                      }`}
                    >
                      <div className="w-full">
                        <h5 className="text-sm font-medium text-black dark:text-white">
                          {parent.username}
                        </h5>
                        <p className="text-gray-6 dark:text-gray-4 truncate text-sm">
                          {parent.lastMessage
                            ? parent.lastMessage.content
                            : 'メッセージはありません。'}
                        </p>
                        {parent.lastMessage && (
                          <p className="text-gray-5 dark:text-gray-5 mt-1 text-xs">
                            {new Date(
                              parent.lastMessage.createdAt
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {parents.length === 0 && (
                    <p className="text-gray-6 dark:text-gray-4 text-center">
                      メッセージはありません。
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Chat Area */}
          {((user?.role === 'coach' &&
            selectedParent &&
            (showChat || windowWidth >= 1280)) ||
            (user?.role === 'parent' && coach)) && (
            <div
              className={`flex h-full flex-col border-l border-stroke dark:border-strokedark ${
                user?.role === 'coach' ? 'w-full xl:w-3/4' : 'w-full'
              }`}
            >
              <div className="sticky flex items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark">
                {user?.role === 'coach' && windowWidth < 1280 && (
                  <button
                    onClick={handleBack}
                    className="text-gray-6 hover:text-gray-7 dark:text-gray-4 mr-4 dark:hover:text-gray-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <div className="flex items-center">
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      {user?.role === 'coach'
                        ? selectedParent?.username
                        : coach?.username}
                    </h5>
                  </div>
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="scrollbar scrollbar-track-gray-200 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 dark:scrollbar-track-boxdark-2 dark:scrollbar-thumb-boxdark-1 max-h-full space-y-3.5 overflow-y-auto px-6 py-7.5 transition-all duration-300 ease-in-out"
              >
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={
                      message.sender._id === user?._id
                        ? 'ml-auto max-w-125'
                        : 'max-w-125'
                    }
                  >
                    <div
                      className={`mb-2.5 rounded-2xl px-5 py-3 ${
                        message.sender._id === user?._id
                          ? 'rounded-br-none bg-primary'
                          : 'rounded-tl-none bg-gray dark:bg-boxdark-2'
                      }`}
                    >
                      <p
                        className={
                          message.sender._id === user?._id
                            ? 'text-white'
                            : 'text-black dark:text-white'
                        }
                      >
                        {message.content}
                      </p>
                    </div>
                    <p
                      className={`text-gray-5 dark:text-gray-5 text-xs ${
                        message.sender._id === user?._id ? 'text-right' : ''
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark dark:bg-boxdark">
                <form
                  className="flex items-center justify-between space-x-4.5"
                  onSubmit={handleSendMessage}
                >
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="メッセージを入力..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="dark:placeholder-gray-4 h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Messages;
