import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../layout/DefaultLayout';
import CoverParent from '../images/cover/cover-parent.png';
import CoverCoach from '../images/cover/cover-coach.png';
import UserDefault from '../images/user/default.png';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { scheduleApi, uploadApi } from '../services/api';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { setUser } from '../store/authSlice';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [recipientNumbers, setRecipientNumbers] = useState<string>(
    user?.recipientNumbers || ''
  );
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [businessNumbers, setBusinessNumbers] = useState<string>(
    user?.businessNumbers || ''
  );
  const [guardianName, setGuardianName] = useState(user?.guardianName || '');
  const [serviceSlot, setServiceSlot] = useState<{
    attendance: { start: string; end: string }[];
    holiday: { start: string; end: string }[];
  }>(user.serviceSlot);
  const [userName, setUserName] = useState<string>(user.username);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('avatar', file, file.name);
        const response = await uploadApi.uploadAvatar(formData);
        dispatch(setUser(response.data.user));
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Prepare data to save
      const profileData = {
        recipientNumbers,
        companyName,
        businessNumbers,
        guardianName,
        serviceSlot,
        username: userName,
      };

      // Call your API to save the profile data
      const response = await scheduleApi.saveProfile(profileData);
      toast.success('プロフィールが保存されました');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('プロフィールの保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={user.role === UserRole.PARENT ? CoverParent : CoverCoach}
            alt="プロフィールカバー"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img
                className="rounded-full"
                src={user.avatar || UserDefault}
                alt="プロフィール"
              />
              <label
                htmlFor="profile"
                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
              >
                <svg
                  className="fill-current"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                  />
                </svg>
                <input
                  type="file"
                  name="profile"
                  id="profile"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-center">
              <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-stroke bg-white p-2 text-center dark:border-strokedark dark:bg-boxdark"
                  placeholder="保護者の名前を入力"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </h3>
            </div>
            <p className="font-medium">
              {user.role === UserRole.PARENT ? '保護者' : '管理者'}
            </p>
            <div className="mx-auto mb-5.5 mt-4.5 grid max-w-94 grid-cols-1 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {user.email}
                </span>
              </div>
            </div>

            {/* New Field for Parents */}
            {user.role === UserRole.PARENT && (
              <div className="mb-4 flex flex-col items-center md:flex-row">
                <label className="block min-w-32 text-sm font-medium">
                  保護者の名前
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-stroke bg-white p-2 dark:border-strokedark dark:bg-boxdark"
                  placeholder="保護者の名前を入力"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
              </div>
            )}

            {/* New Fields for Coaches */}
            {user.role === UserRole.PARENT && (
              <div className="w-md mx-auto mt-4">
                <h4 className="text-lg font-semibold">管理者情報</h4>
                <div className="flex flex-col justify-evenly gap-3 md:flex-row">
                  <div className="mb-4 w-60">
                    <label className="block text-sm font-medium">
                      受給者証番号
                    </label>
                    <input
                      type="text"
                      value={recipientNumbers}
                      className="mt-1 block w-full rounded-md border border-stroke bg-white p-2 dark:border-strokedark dark:bg-boxdark"
                      placeholder="受給者証番号を入力"
                      onChange={(e) => {
                        const value = e.target.value;
                        setRecipientNumbers(value);
                      }}
                    />
                  </div>
                  <div className="mb-4 w-60">
                    <label className="block text-sm font-medium">会社名</label>
                    <input
                      type="text"
                      value={companyName}
                      className="mt-1 block w-full rounded-md border border-stroke bg-white p-2 dark:border-strokedark dark:bg-boxdark"
                      placeholder="会社名を入力"
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4 w-60">
                    <label className="block text-sm font-medium">
                      事業所番号
                    </label>
                    <input
                      type="text"
                      value={businessNumbers}
                      className="mt-1 block w-full rounded-md border border-stroke bg-white p-2 dark:border-strokedark dark:bg-boxdark"
                      placeholder="事業所番号を入力"
                      onChange={(e) => {
                        const value = e.target.value;
                        setBusinessNumbers(value);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* New Fields for Coaches */}
            {user.role === UserRole.PARENT && (
              <div className="mt-4">
                <div className="mb-4">
                  <h5 className="text-md font-semibold">
                    学校登校日と学校休校日
                  </h5>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2">日</th>
                        <th className="border p-2" colSpan={2}>
                          学校登校日
                        </th>
                        <th className="border p-2" colSpan={2}>
                          学校休校日
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">月</td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[0].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[0] = {
                                  ...newAttendance[0],
                                  start: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[0].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[0] = {
                                  ...newAttendance[0],
                                  end: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[0].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[0] = {
                                  ...newHoliday[0],
                                  start: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[0].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[0] = {
                                  ...newHoliday[0],
                                  end: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">火</td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[1].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[1] = {
                                  ...newAttendance[1],
                                  start: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[1].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[1] = {
                                  ...newAttendance[1],
                                  end: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[1].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[1] = {
                                  ...newHoliday[1],
                                  start: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[1].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[1] = {
                                  ...newHoliday[1],
                                  end: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">水</td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[2].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[2] = {
                                  ...newAttendance[2],
                                  start: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[2].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[2] = {
                                  ...newAttendance[2],
                                  end: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[2].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[2] = {
                                  ...newHoliday[2],
                                  start: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[2].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[2] = {
                                  ...newHoliday[2],
                                  end: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">木</td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[3].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[3] = {
                                  ...newAttendance[3],
                                  start: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[3].end}
                            onChange={(e) => {
                              const newAttendance = [...serviceSlot.attendance];
                              newAttendance[3].end = e.target.value;
                              setServiceSlot((prev) => ({
                                ...prev,
                                attendance: newAttendance,
                              }));
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[3].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[3] = {
                                  ...newHoliday[3],
                                  start: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[3].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[3] = {
                                  ...newHoliday[3],
                                  end: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">金</td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[4].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[4] = {
                                  ...newAttendance[4],
                                  start: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[4].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[4] = {
                                  ...newAttendance[4],
                                  end: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[4].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[4] = {
                                  ...newHoliday[4],
                                  start: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[4].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[4] = {
                                  ...newHoliday[4],
                                  end: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-2">土</td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[5].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[5] = {
                                  ...newAttendance[5],
                                  start: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.attendance[5].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newAttendance = [...prev.attendance];
                                newAttendance[5] = {
                                  ...newAttendance[5],
                                  end: e.target.value,
                                }; // Create a new object for the attendance entry
                                return { ...prev, attendance: newAttendance }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[5].start}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[5] = {
                                  ...newHoliday[5],
                                  start: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="time"
                            value={serviceSlot.holiday[5].end}
                            onChange={(e) => {
                              setServiceSlot((prev) => {
                                const newHoliday = [...prev.holiday];
                                newHoliday[5] = {
                                  ...newHoliday[5],
                                  end: e.target.value,
                                }; // Create a new object for the holiday entry
                                return { ...prev, holiday: newHoliday }; // Return the updated state
                              });
                            }}
                            className="dark:bg-gray-700 w-full rounded border border-stroke bg-transparent p-2 text-black dark:border-strokedark dark:text-white"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
