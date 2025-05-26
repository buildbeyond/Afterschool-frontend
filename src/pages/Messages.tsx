import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import api, { downloadApi, uploadApi } from '../services/api';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import useColorMode from '../hooks/useColorMode';
import UserDefault from '../images/user/default.png';
import { UserRole } from '../types';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  lastMessage?: {
    content: string;
    attachment: string;
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
  attachment: {
    _id: string;
    fileName: string;
    fileContent: string;
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
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [attachment, setAttachment] = useState<File | undefined>(undefined);

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
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Authenticate with token
    const token = Cookies.get('token');
    if (token) {
      socketRef.current.emit('authenticate', token);
    }

    // Handle authentication success
    socketRef.current.on('authenticated', () => {});

    // Handle authentication error
    socketRef.current.on('auth_error', () => {});

    // Handle connection events
    socketRef.current.on('connect', () => {
      // Re-authenticate on reconnection
      if (token) {
        socketRef.current?.emit('authenticate', token);
      }
    });

    socketRef.current.on('disconnect', () => {});

    socketRef.current.on('connect_error', () => {});

    // Listen for new messages
    socketRef.current.on('new_message', (message: Message) => {
      const otherUser = user?.role === 'coach' ? selectedParent : coach;

      if (
        otherUser &&
        ((message.sender._id === otherUser._id &&
          message.receiver._id === user?._id) ||
          (message.sender._id === user?._id &&
            message.receiver._id === otherUser._id))
      ) {
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
    socketRef.current.on('message_error', () => {});

    // Cleanup on unmount
    return () => {
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
    if ((!newMessage.trim() && !attachment) || !otherUser || !socketRef.current)
      return;

    try {
      // Send message through Socket.IO
      if (attachment) {
        const formData = new FormData();
        formData.append('attachment', attachment);
        const response = await uploadApi.uploadAttachment(formData);
        console.log({
          sender: user._id,
          receiver: otherUser._id,
          content: newMessage.trim(),
          attachment: response.data.attachment,
        });
        socketRef.current.emit('send_message', {
          sender: user._id,
          receiver: otherUser._id,
          content: newMessage.trim(),
          attachment: response.data.attachment,
        });
      } else {
        socketRef.current.emit('send_message', {
          sender: user._id,
          receiver: otherUser._id,
          content: newMessage.trim(),
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setNewMessage('');
      fileRef.current.value = '';
      setAttachment(null);
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

  const handleAddAttachment = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleAttachmentChange = (e) => {
    if (e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleDownloadAttachment = async (
    attachmentId: string,
    fileName: string
  ) => {
    try {
      const response = await downloadApi.downloadAttachment(attachmentId);
      if (response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.log('Error download attachment: ', err);
    }
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
                      <div className="relative mr-3.5 min-h-11 min-w-11 max-w-11">
                        <img
                          src={parent.avatar || UserDefault}
                          alt="profile"
                          className="h-full w-full rounded-full object-cover object-center"
                        />
                        {/* <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-2 bg-success"></span> */}
                      </div>
                      <div className="w-full overflow-hidden">
                        <h5 className="text-sm font-medium text-black dark:text-white">
                          {parent.username}
                        </h5>
                        <p className="text-gray-6 dark:text-gray-4 truncate text-ellipsis text-sm">
                          {parent.lastMessage ? (
                            parent.lastMessage.content ? (
                              parent.lastMessage.content
                            ) : parent.lastMessage.attachment ? (
                              '[添付ファイルを送った。]'
                            ) : (
                              ''
                            )
                          ) : (
                            <span>
                              メッセージは
                              <br />
                              ありません。
                            </span>
                          )}
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
                  <div className="relative mr-3.5 h-11 w-full max-w-11">
                    <img
                      src={
                        user?.role === UserRole.COACH
                          ? selectedParent?.avatar || UserDefault
                          : coach?.avatar || UserDefault
                      }
                      alt="profile"
                      className="h-full w-full rounded-full object-cover object-center"
                    />
                    {/* <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-2 bg-success"></span> */}
                  </div>
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                      {user?.role === UserRole.COACH
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
                      {message.attachment && (
                        <div className="text-right">
                          <span
                            onClick={() =>
                              handleDownloadAttachment(
                                message.attachment._id,
                                message.attachment.fileName
                              )
                            }
                            className={`${
                              message.sender._id === user?._id
                                ? 'text-white'
                                : 'text-slate-700 dark:text-white'
                            } cursor-pointer text-sm underline hover:text-blue-400`}
                          >
                            {message.attachment.fileName}
                          </span>
                        </div>
                      )}
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
                <div className="flex items-center">
                  <div className="grow">
                    <form onSubmit={handleSendMessage}>
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
                  <button
                    className="h-13 w-13 rounded-md p-3 hover:bg-[rgba(0,0,0,0.1)]"
                    onClick={handleAddAttachment}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20 10.9696L11.9628 18.5497C10.9782 19.4783 9.64274 20 8.25028 20C6.85782 20 5.52239 19.4783 4.53777 18.5497C3.55315 17.6211 3 16.3616 3 15.0483C3 13.7351 3.55315 12.4756 4.53777 11.547L12.575 3.96687C13.2314 3.34779 14.1217 3 15.05 3C15.9783 3 16.8686 3.34779 17.525 3.96687C18.1814 4.58595 18.5502 5.4256 18.5502 6.30111C18.5502 7.17662 18.1814 8.01628 17.525 8.63535L9.47904 16.2154C9.15083 16.525 8.70569 16.6989 8.24154 16.6989C7.77738 16.6989 7.33224 16.525 7.00403 16.2154C6.67583 15.9059 6.49144 15.4861 6.49144 15.0483C6.49144 14.6106 6.67583 14.1907 7.00403 13.8812L14.429 6.88674"
                        stroke="#AEB7C0"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <input
                      type="file"
                      ref={fileRef}
                      onChange={handleAttachmentChange}
                      hidden
                    />
                  </button>
                </div>
                {attachment && (
                  <div className="flex items-center justify-end pt-2">
                    {attachment.name}
                    <button
                      onClick={() => {
                        setAttachment(undefined);
                      }}
                      className="ml-2 h-6 w-6 items-center justify-center rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <g id="Edit / Close_Circle">
                          <path
                            id="Vector"
                            d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                            stroke="#F43F8E"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Messages;
