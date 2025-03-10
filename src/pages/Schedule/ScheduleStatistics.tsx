import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DatePickerJp from '../../components/Forms/DatePicker/DatePickerJp';

import kid from '../../images/user/kid.png';

interface ParentScheduleEntry {
  id: string;
  name: string;
  avatar?: string;
  reason?: string;
  isAbsent?: boolean;
  hadSnack?: boolean;
  isNight?: boolean;
  className?: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart: string;
  actualEnd: string;
  plannedPickup: boolean;
  plannedReturn: boolean;
  actualPickup: boolean;
  actualReturn: boolean;
  notes?: string;
  lunch: boolean;
  dinner: boolean;
  plannedPickupLocation?: string;
  plannedReturnLocation?: string;
}

interface ParentScheduleData {
  date: string;
  entries: ParentScheduleEntry[];
}

const ScheduleStats: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState<ParentScheduleEntry[]>([
    {
      id: '1',
      name: '中村 絵衣子',
      avatar: kid,
      className: '年長クラス',
      plannedStart: '16:00',
      plannedEnd: '17:30',
      actualStart: '16:05',
      actualEnd: '17:25',
      plannedPickup: true,
      plannedReturn: true,
      actualPickup: true,
      actualReturn: true,
      notes: '元気に過ごしました',
      lunch: true,
      dinner: true,
      plannedPickupLocation: '学校',
      plannedReturnLocation: '学校',
    },
    {
      id: '2',
      name: '佐藤 太郎',
      avatar: kid,
      className: '年中クラス',
      plannedStart: '09:00',
      plannedEnd: '14:00',
      actualStart: '09:10',
      actualEnd: '14:05',
      plannedPickup: false,
      plannedReturn: true,
      actualPickup: false,
      actualReturn: true,
      notes: 'おやつ完食',
      lunch: true,
      dinner: true,
      plannedPickupLocation: '学校',
      plannedReturnLocation: '学校',
    },
    {
      id: '3',
      name: '鈴木 花子',
      avatar: kid,
      className: '年少クラス',
      plannedStart: '08:30',
      plannedEnd: '16:30',
      actualStart: '08:35',
      actualEnd: '',
      plannedPickup: true,
      plannedReturn: true,
      actualPickup: true,
      actualReturn: false,
      isAbsent: true,
      notes: '体調不良のため早退',
      lunch: true,
      dinner: true,
      plannedPickupLocation: '学校',
      plannedReturnLocation: '学校',
    },
    {
      id: '4',
      name: '田中 優子',
      avatar: kid,
      className: '年長クラス',
      plannedStart: '09:30',
      plannedEnd: '18:00',
      actualStart: '09:25',
      actualEnd: '18:05',
      plannedPickup: true,
      plannedReturn: true,
      actualPickup: true,
      actualReturn: true,
      hadSnack: true,
      lunch: true,
      dinner: true,
      plannedPickupLocation: '学校',
      plannedReturnLocation: '学校',
    },
    {
      id: '5',
      name: '山田 健太',
      avatar: kid,
      className: '年中クラス',
      plannedStart: '08:00',
      plannedEnd: '15:00',
      actualStart: '08:00',
      actualEnd: '15:00',
      plannedPickup: false,
      plannedReturn: false,
      actualPickup: false,
      actualReturn: false,
      hadSnack: true,
      lunch: true,
      dinner: true,
      plannedPickupLocation: '学校',
      plannedReturnLocation: '学校',
    },
    {
      id: '6',
      name: '伊藤 美咲',
      avatar: kid,
      className: '年少クラス',
      plannedStart: '10:00',
      plannedEnd: '16:00',
      actualStart: '',
      actualEnd: '',
      plannedPickup: true,
      plannedReturn: true,
      actualPickup: false,
      actualReturn: false,
      isAbsent: true,
      notes: '発熱のため欠席',
      lunch: true,
      dinner: true,
      plannedPickupLocation: '学校',
      plannedReturnLocation: '学校',
    },
    {
      id: '7',
      name: '渡辺 翔太',
      avatar: kid,
      className: '年長クラス',
      plannedStart: '09:00',
      plannedEnd: '17:00',
      actualStart: '09:15',
      actualEnd: '17:00',
      plannedPickup: true,
      plannedReturn: true,
      actualPickup: true,
      actualReturn: true,
      hadSnack: true,
      lunch: true,
      dinner: true,
      plannedPickupLocation: '学校',
      plannedReturnLocation: '学校',
    },
    {
      id: '8',
      name: '小林 さくら',
      avatar: kid,
      className: '年中クラス',
      plannedStart: '08:30',
      plannedEnd: '16:30',
      actualStart: '08:40',
      actualEnd: '16:25',
      plannedPickup: false,
      plannedReturn: true,
      actualPickup: false,
      actualReturn: true,
      hadSnack: true,
      lunch: true,
      dinner: true,
      plannedPickupLocation: '学校',
      plannedReturnLocation: '学校',
    },
    {
      id: '9',
      name: '加藤 陽太',
      avatar: kid,
      className: '年少クラス',
      plannedStart: '09:30',
      plannedEnd: '15:30',
      actualStart: '09:35',
      actualEnd: '15:35',
      plannedPickup: true,
      plannedReturn: false,
      actualPickup: true,
      actualReturn: false,
      hadSnack: true,
      lunch: true,
      dinner: true,
      plannedPickupLocation: '学校',
      plannedReturnLocation: '学校',
    },
    {
      id: '10',
      name: '吉田 めぐみ',
      avatar: kid,
      className: '年長クラス',
      plannedStart: '08:00',
      plannedEnd: '18:00',
      actualStart: '08:05',
      actualEnd: '18:00',
      plannedPickup: true,
      plannedReturn: true,
      actualPickup: true,
      actualReturn: true,
      hadSnack: true,
      isNight: true,
      lunch: true,
      dinner: true,
      plannedPickupLocation: '学校',
      plannedReturnLocation: '学校',
    },
  ]);
  const handlePrevDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };
  const handleInputChange = (
    index: number,
    field: keyof ParentScheduleEntry,
    value: string | boolean
  ) => {
    const newScheduleData = [...scheduleData];
    newScheduleData[index] = {
      ...newScheduleData[index],
      [field]: value,
    };
    setScheduleData(newScheduleData);
  };

  const handleTimeChange = (
    index: number,
    field: keyof ParentScheduleEntry,
    value: string
  ) => {
    handleInputChange(index, field, value);
  };
  const handleTodayDate = () => {
    setSelectedDate(new Date());
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="スケジュール統計" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="hover:bg-gray-100 rounded-lg border border-stroke p-2 dark:border-strokedark dark:hover:bg-meta-4"
                onClick={handlePrevDate}
              >
                <svg
                  className="fill-current"
                  width="7"
                  height="11"
                  viewBox="0 0 7 11"
                >
                  <path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" />
                </svg>
              </button>
              <div className="w-48">
                <DatePickerJp
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </div>
              <button
                className="hover:bg-gray-100 rounded-lg border border-stroke p-2 dark:border-strokedark dark:hover:bg-meta-4"
                onClick={handleNextDate}
              >
                <svg
                  className="fill-current"
                  width="7"
                  height="11"
                  viewBox="0 0 7 11"
                >
                  <path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" />
                </svg>
              </button>
              <button
                className="hover:bg-gray-100 rounded-lg border border-stroke px-3 py-2 dark:border-strokedark dark:hover:bg-meta-4"
                onClick={handleTodayDate}
              >
                今日
              </button>
            </div>
            <div className="flex items-center gap-2">
              {/** Download button */}
              <button className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90">
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12.75L13.5 8.25H10.5V1.5H7.5V8.25H4.5L9 12.75Z"
                    fill="currentColor"
                  />
                  <path
                    d="M1.5 15.75H16.5V12.75H15V14.25H3V12.75H1.5V15.75Z"
                    fill="currentColor"
                  />
                </svg>
                ダウンロード
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
                  <th className="p-2.5 text-center">
                    <h5 className="text-sm font-medium">名前</h5>
                  </th>
                  <th className="p-2.5 text-center">
                    <h5 className="text-sm font-medium">クラス</h5>
                  </th>
                  <th className="p-2.5 text-center">
                    <h5 className="text-sm font-medium">出欠</h5>
                  </th>
                  <th className="p-2.5 text-center">
                    <h5 className="text-sm font-medium">欠席</h5>
                  </th>
                  <th
                    colSpan={4}
                    className="border-l border-r border-stroke dark:border-strokedark"
                  >
                    <div className="border-b px-4 py-2 text-center">
                      <span className="text-sm font-medium">予定</span>
                    </div>
                    <div className="grid grid-cols-4">
                      <div className="col-span-2 border-r border-stroke px-4 py-2 text-center dark:border-strokedark">
                        <span className="text-sm font-medium">時間</span>
                      </div>
                      <div className="px-4 py-2 text-center">
                        <span className="text-sm font-medium">往</span>
                      </div>
                      <div className="px-4 py-2 text-center">
                        <span className="text-sm font-medium">復</span>
                      </div>
                    </div>
                  </th>
                  <th
                    colSpan={2}
                    className="border-l border-r border-stroke dark:border-strokedark"
                  >
                    <div className="border-b px-4 py-2 text-center">
                      <span className="text-sm font-medium">実績</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="col-span-2 px-4 py-2 text-center">
                        <span className="text-sm font-medium">時間</span>
                      </div>
                    </div>
                  </th>
                  <th className="p-2.5 text-center">
                    <h5 className="text-sm font-medium">おやつ</h5>
                  </th>
                  <th className="p-2.5 text-center">
                    <h5 className="text-sm font-medium">昼食</h5>
                  </th>
                  <th className="p-2.5 text-center">
                    <h5 className="text-sm font-medium">夕食</h5>
                  </th>
                  <th className="p-2.5 text-center">
                    <h5 className="text-sm font-medium">備考</h5>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke dark:divide-strokedark">
                {scheduleData.map((entry, index) => (
                  <tr key={entry.id}>
                    <td className="border-stroke p-2.5 dark:border-strokedark">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full">
                          <img src={entry.avatar} alt="User" />
                        </div>
                        <p className="text-sm">{entry.name}</p>
                      </div>
                    </td>
                    <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                      <p className="text-sm">{entry.className}</p>
                    </td>
                    <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={!entry.isAbsent}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              'isAbsent',
                              !e.target.checked
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </td>
                    <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={entry.isAbsent}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              'isAbsent',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </td>
                    <td
                      colSpan={4}
                      className="border-l border-r border-stroke dark:border-strokedark"
                    >
                      <div className="grid grid-cols-4">
                        <div className="col-span-2 flex items-center gap-2 border-r border-stroke p-2.5 dark:border-strokedark">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {entry.plannedStart}
                            </span>
                            <span>-</span>
                            <span className="text-sm">{entry.plannedEnd}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="flex h-8 min-w-[3.75rem] items-center justify-center rounded border border-stroke px-2">
                            <span className="text-sm">
                              {entry.plannedPickupLocation}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="flex h-8 min-w-[3.75rem] items-center justify-center rounded border border-stroke px-2">
                            <span className="text-sm">
                              {entry.plannedReturnLocation}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      colSpan={2}
                      className="border-l border-r border-stroke dark:border-strokedark"
                    >
                      <div className="grid grid-cols-2">
                        <div className="col-span-2 flex items-center justify-center gap-2 p-2.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={entry.actualStart}
                              onChange={(e) =>
                                handleTimeChange(
                                  index,
                                  'actualStart',
                                  e.target.value
                                )
                              }
                              className="w-23 rounded border border-stroke bg-transparent px-2 py-1 text-sm dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                            />
                            <span>-</span>
                            <input
                              type="time"
                              value={entry.actualEnd}
                              onChange={(e) =>
                                handleTimeChange(
                                  index,
                                  'actualEnd',
                                  e.target.value
                                )
                              }
                              className="w-23 rounded border border-stroke bg-transparent px-2 py-1 text-sm dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={entry.hadSnack}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              'hadSnack',
                              e.target.checked
                            )
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </td>
                    <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={entry.lunch}
                          onChange={(e) =>
                            handleInputChange(index, 'lunch', e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </td>
                    <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={entry.dinner}
                          onChange={(e) =>
                            handleInputChange(index, 'dinner', e.target.checked)
                          }
                          className="h-4 w-4"
                        />
                      </div>
                    </td>
                    <td className="border-stroke p-2.5 dark:border-strokedark">
                      <input
                        type="text"
                        value={entry.notes || ''}
                        onChange={(e) =>
                          handleInputChange(index, 'notes', e.target.value)
                        }
                        className="w-full rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ScheduleStats;
