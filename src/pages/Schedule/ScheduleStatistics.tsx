import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DatePickerJp from '../../components/Forms/DatePicker/DatePickerJp';
import { scheduleApi } from '../../services/api';
import { toast } from 'react-toastify';
import { ParentScheduleData, ParentScheduleEntry } from '../../types';

const ScheduleStats: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState<ParentScheduleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load schedule data for the selected date
  const loadScheduleData = async (date: Date) => {
    try {
      setIsLoading(true);
      const month = (date.getMonth() + 1).toString();
      const year = date.getFullYear().toString();
      const day = date.getDate().toString();

      const response = await scheduleApi.getScheduleStats(month, day, year);

      // Check if we have schedules data
      if (response && response.stats) {
        setScheduleData(response.stats);
      } else {
        console.log('No schedules data in response'); // Debug log
        setScheduleData([]);
      }
    } catch (error) {
      console.error('Error loading schedule data:', error);
      toast.error('スケジュールデータの読み込みに失敗しました');
      setScheduleData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when date changes
  useEffect(() => {
    loadScheduleData(selectedDate);
  }, [selectedDate]);

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
      scheduleInfo: {
        ...newScheduleData[index].scheduleInfo,
        [field]: value,
      },
    };
    setScheduleData(newScheduleData);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const month = (selectedDate.getMonth() + 1).toString();
      const day = selectedDate.getDate().toString();
      const year = selectedDate.getFullYear().toString();
      const response = await scheduleApi.submitScheduleStats(
        month,
        day,
        year,
        scheduleData
      );
      toast.success('スケジュール提出成功');
    } catch (error) {
      console.error('スケジュール提出エラー:', error);
      toast.error('スケジュール提出に失敗しました');
    } finally {
      setIsLoading(false);
    }
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

  const headerData = (
    <thead>
      <tr className="border-b border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
        <th className="p-2.5 text-center">
          <h5 className="text-sm font-medium">名前</h5>
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
  );

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
              {/** Submit button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                'スケジュール提出'
              </button>
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
            {isLoading ? (
              <>
                {' '}
                <table className="w-full">{headerData}</table>
                <div className="flex h-40 items-center justify-center">
                  <p>データを読み込んでいます...</p>
                </div>
              </>
            ) : scheduleData.length > 0 ? (
              <table className="w-full">
                {headerData}
                <tbody className="divide-y divide-stroke dark:divide-strokedark">
                  {scheduleData.map((entry, index) => (
                    <tr key={entry.user.id}>
                      <td className="border-stroke p-2.5 dark:border-strokedark">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-full">
                            <img src={entry.user.avatar} alt="User" />
                          </div>
                          <p className="text-sm">{entry.user.username}</p>
                        </div>
                      </td>
                      <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={!entry.scheduleInfo.wasAbsent}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                'wasAbsent',
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
                            checked={entry.scheduleInfo.wasAbsent}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                'wasAbsent',
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
                                {entry.scheduleInfo.plannedStart}
                              </span>
                              <span>-</span>
                              <span className="text-sm">
                                {entry.scheduleInfo.plannedEnd}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="flex h-8 min-w-[3.75rem] items-center justify-center rounded px-2">
                              <span className="text-sm">
                                {entry.scheduleInfo.plannedPickupLocation}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="flex h-8 min-w-[3.75rem] items-center justify-center rounded px-2">
                              <span className="text-sm">
                                {entry.scheduleInfo.plannedReturnLocation}
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
                                value={entry.scheduleInfo.actualStart}
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
                                value={entry.scheduleInfo.actualEnd}
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
                            checked={entry.scheduleInfo.hadSnack}
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
                        {entry.scheduleInfo.lunch && (
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={entry.scheduleInfo.hadLunch}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  'hadLunch',
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4"
                            />
                          </div>
                        )}
                      </td>
                      <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                        {entry.scheduleInfo.dinner && (
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={entry.scheduleInfo.hadDinner}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  'hadDinner',
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4"
                            />
                          </div>
                        )}
                      </td>
                      <td className="border-stroke p-2.5 dark:border-strokedark">
                        <input
                          type="text"
                          value={entry.scheduleInfo.remarks || ''}
                          onChange={(e) =>
                            handleInputChange(index, 'remarks', e.target.value)
                          }
                          className="w-full rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <>
                <table className="w-full">{headerData}</table>
                <div className="flex h-40 items-center justify-center">
                  <p>この日の申し込みはありません</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ScheduleStats;
