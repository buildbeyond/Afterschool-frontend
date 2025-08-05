import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DatePickerJp from '../../components/Forms/DatePicker/DatePickerJp';
import { scheduleApi } from '../../services/api';
import { toast } from 'react-toastify';
import {
  locationOptions,
  ParentScheduleData,
  ParentScheduleEntry,
  premiumOptions,
} from '../../types';
import DefaultUser from '../../images/user/default.png';
import { useNavigate } from 'react-router-dom';
import SelectWithInput from '../../components/SelectWithInput';

const ScheduleStats: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState<ParentScheduleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

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
        ...(field === 'wasPresent' && { wasAbsent: false }),
        ...(field === 'wasAbsent' && { wasPresent: false }),
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
      await scheduleApi.submitScheduleStats(scheduleData, '', year, month, day);
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

  const handleDownload = async (index: number) => {
    try {
      setIsLoading(true);
      const month = (selectedDate.getMonth() + 1).toString();
      const year = selectedDate.getFullYear().toString();
      const user = scheduleData[index].user.id;
      const data = await scheduleApi.downloadReportData(month, year, user);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `実績-${scheduleData[index].user.username}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUserSchedule = (index: number) => {
    navigate(
      `/schedule/${
        scheduleData[index].user.id
      }?year=${selectedDate.getFullYear()}&month=${selectedDate.getMonth()}`
    );
  };

  const headerData = (
    <thead>
      <tr className="border-b border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
        <th className="p-2.5 text-center">
          <h5 className="text-sm font-medium">名前</h5>
        </th>
        {/* <th className="p-2.5 text-center">
          <h5 className="text-sm font-medium">休</h5>
        </th> */}
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
        <th className="p-2.5 text-center text-sm font-medium">
          <div className="min-w-max">
            追加利用
            <br />
            希望
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
          <h5 className="text-sm font-medium">入力</h5>
        </th>
        <th className="p-2.5 text-center">
          <h5 className="text-sm font-medium">備考</h5>
        </th>
        <th className="p-2.5 text-center">
          {/* <h5 className="text-sm font-medium">ダウンロード</h5> */}
        </th>
      </tr>
    </thead>
  );

  return (
    <DefaultLayout>
      <Breadcrumb pageName="スケジュール統計" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between gap-y-4 max-md:flex-col">
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
                入力反映
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-36 md:max-h-[calc(100vh-300px)]">
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
                  {scheduleData.map((entry, index) => {
                    if (entry.scheduleInfo.isHoliday) {
                      return;
                    }
                    const isRowDisabled =
                      entry.scheduleInfo.wasAbsent ||
                      entry.scheduleInfo.isHoliday;
                    return (
                      <tr key={entry.user.id}>
                        <td className="border-stroke p-2.5 dark:border-strokedark">
                          <div className="flex min-w-max items-center gap-3">
                            <div className="h-12 w-12 overflow-hidden rounded-full">
                              <a
                                href="#"
                                className="text-sm hover:text-blue-500"
                                onClick={() => handleViewUserSchedule(index)}
                              >
                                <img
                                  src={entry.user.avatar || DefaultUser}
                                  alt="User"
                                />
                              </a>
                            </div>
                            <a
                              href="#"
                              className="text-sm hover:text-blue-500"
                              onClick={() => handleViewUserSchedule(index)}
                            >
                              {entry.user.username}
                            </a>
                          </div>
                        </td>
                        {/* <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                          <div className="flex min-w-max items-center justify-center">
                            <input
                              type="checkbox"
                              checked={entry.scheduleInfo.isHoliday}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  'isHoliday',
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4"
                            />
                          </div>
                        </td> */}
                        <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                          <div className="flex min-w-max items-center justify-center">
                            {!entry.scheduleInfo.isHoliday ? (
                              <input
                                type="checkbox"
                                checked={entry.scheduleInfo.wasPresent}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    'wasPresent',
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4"
                              />
                            ) : (
                              <input
                                type="checkbox"
                                disabled
                                className="h-4 w-4"
                              />
                            )}
                          </div>
                        </td>
                        <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                          <div className="flex min-w-max items-center justify-center">
                            {!entry.scheduleInfo.isHoliday ? (
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
                            ) : (
                              <input
                                type="checkbox"
                                disabled
                                className="h-4 w-4"
                              />
                            )}
                          </div>
                        </td>
                        <td
                          colSpan={4}
                          className="border-l border-r border-stroke dark:border-strokedark"
                        >
                          <div className="grid min-w-max grid-cols-4">
                            <div className="col-span-2 flex items-center justify-center gap-2 border-r border-stroke p-2.5 dark:border-strokedark">
                              {!isRowDisabled ? (
                                <input
                                  type="time"
                                  value={entry.scheduleInfo.plannedStart}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      index,
                                      'plannedStart',
                                      e.target.value
                                    )
                                  }
                                  className="h-10 w-25 rounded border border-stroke bg-transparent px-2 dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                                />
                              ) : (
                                <input
                                  type="time"
                                  className="h-10 w-25 rounded border border-stroke bg-transparent px-2 dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                                  value=""
                                  disabled
                                />
                              )}
                              <span>-</span>
                              {!isRowDisabled ? (
                                <input
                                  type="time"
                                  value={entry.scheduleInfo.plannedEnd}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      index,
                                      'plannedEnd',
                                      e.target.value
                                    )
                                  }
                                  className="h-10 w-25 rounded border border-stroke bg-transparent px-2 dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                                />
                              ) : (
                                <input
                                  type="time"
                                  className="h-10 w-25 rounded border border-stroke bg-transparent px-2 dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                                  value=""
                                  disabled
                                />
                              )}
                            </div>
                            <div className="flex flex-row items-center justify-center gap-2 px-2">
                              {!isRowDisabled ? (
                                <input
                                  type="checkbox"
                                  checked={entry.scheduleInfo.plannedPickup}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      'plannedPickup',
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4"
                                />
                              ) : (
                                <input
                                  type="checkbox"
                                  disabled
                                  className="h-4 w-4"
                                />
                              )}
                              {!isRowDisabled ? (
                                <SelectWithInput
                                  options={locationOptions.map((v) => v)}
                                  value={
                                    entry.scheduleInfo.plannedPickupLocation
                                  }
                                  onChange={(v) => {
                                    handleInputChange(
                                      index,
                                      'plannedPickupLocation',
                                      v
                                    );
                                  }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value=""
                                  disabled
                                  className="w-24 rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                                />
                              )}
                            </div>
                            <div className="flex flex-row items-center justify-center gap-2 px-2">
                              {!isRowDisabled ? (
                                <input
                                  type="checkbox"
                                  checked={entry.scheduleInfo.plannedReturn}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      'plannedReturn',
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4"
                                />
                              ) : (
                                <input
                                  type="checkbox"
                                  disabled
                                  className="h-4 w-4"
                                />
                              )}
                              {!isRowDisabled ? (
                                <SelectWithInput
                                  options={locationOptions.map((v) => v)}
                                  value={
                                    entry.scheduleInfo.plannedReturnLocation
                                  }
                                  onChange={(v) => {
                                    handleInputChange(
                                      index,
                                      'plannedReturnLocation',
                                      v
                                    );
                                  }}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value=""
                                  disabled
                                  className="w-24 rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                                />
                              )}
                            </div>
                          </div>
                        </td>
                        <td
                          colSpan={2}
                          className="border-l border-r border-stroke dark:border-strokedark"
                        >
                          <div className="grid min-w-max grid-cols-2">
                            <div className="col-span-2 flex items-center justify-center gap-2 p-2.5">
                              <div className="flex items-center gap-2">
                                {!isRowDisabled ? (
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
                                ) : (
                                  <input
                                    type="time"
                                    value=""
                                    className="w-23 rounded border border-stroke bg-transparent px-2 py-1 text-sm dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                                  />
                                )}
                                <span>-</span>
                                {!isRowDisabled ? (
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
                                ) : (
                                  <input
                                    type="time"
                                    value=""
                                    className="w-23 rounded border border-stroke bg-transparent px-2 py-1 text-sm dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                                  />
                                )}
                                {!isRowDisabled ? (
                                  <select
                                    value={entry.scheduleInfo.actualAmount}
                                    onChange={(e) => {
                                      handleInputChange(
                                        index,
                                        'actualAmount',
                                        e.target.value
                                      );
                                    }}
                                    className="ml-4 rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark dark:bg-boxdark"
                                  >
                                    <option value="0">0</option>
                                    <option value="0.5">0.5</option>
                                    <option value="1.0">1.0</option>
                                    <option value="1.5">1.5</option>
                                    <option value="2.0">2.0</option>
                                    <option value="2.5">2.5</option>
                                    <option value="3.0">3.0</option>
                                    <option value="5.0">5.0</option>
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value=""
                                    disabled
                                    className="ml-4 w-15 rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                          <div className="flex min-w-max items-center justify-center">
                            {!isRowDisabled ? (
                              <input
                                type="checkbox"
                                checked={entry.scheduleInfo.additionalUse}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    'additionalUse',
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4"
                              />
                            ) : (
                              <input
                                type="checkbox"
                                checked={false}
                                disabled
                                className="h-4 w-4"
                              />
                            )}
                          </div>
                        </td>
                        <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                          <div className="flex min-w-max items-center justify-center">
                            {!isRowDisabled ? (
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
                            ) : (
                              <input
                                type="checkbox"
                                disabled
                                className="h-4 w-4"
                                checked={false}
                              />
                            )}
                          </div>
                        </td>
                        <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                          <div className="flex min-w-max items-center justify-center">
                            {!isRowDisabled ? (
                              <input
                                type="checkbox"
                                checked={entry.scheduleInfo.lunch}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    'lunch',
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4"
                              />
                            ) : (
                              <input
                                type="checkbox"
                                disabled
                                className="h-4 w-4"
                                checked={false}
                              />
                            )}
                          </div>
                        </td>
                        <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                          <div className="flex min-w-max items-center justify-center">
                            {!isRowDisabled ? (
                              <input
                                type="checkbox"
                                checked={entry.scheduleInfo.dinner}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    'dinner',
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4"
                              />
                            ) : (
                              <input
                                type="checkbox"
                                disabled
                                className="h-4 w-4"
                                checked={false}
                              />
                            )}
                          </div>
                        </td>
                        <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                          <button
                            className="bg-gray-200 min-w-max rounded-md px-4 py-2"
                            onClick={() => {
                              // Toggle dropdown for this entry
                              setActiveDropdownIndex(
                                activeDropdownIndex === index ? null : index
                              );
                            }}
                            disabled={isRowDisabled}
                          >
                            選択
                          </button>
                        </td>
                        <td className="border-stroke p-2.5 dark:border-strokedark">
                          {!isRowDisabled ? (
                            <input
                              type="text"
                              value={entry.scheduleInfo.remarks || ''}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  'remarks',
                                  e.target.value
                                )
                              }
                              className="w-full min-w-32 rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                              disabled={isRowDisabled}
                            />
                          ) : (
                            <input
                              type="text"
                              value=""
                              className="w-full min-w-32 rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                              disabled
                            />
                          )}
                        </td>
                        {/* <td className="border-stroke p-2.5 dark:border-strokedark">
                        <div className="flex min-w-max items-center gap-2">
                          <button
                            className="inline-flex items-center gap-2 rounded bg-primary px-2 py-2 font-medium text-white hover:bg-opacity-90"
                            onClick={() => handleDownload(index)}
                          >
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
                          </button>
                        </div>
                      </td> */}
                      </tr>
                    );
                  })}
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
      {/* Full-screen modal for dropdown */}
      {activeDropdownIndex !== null && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveDropdownIndex(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-lg border border-stroke bg-white shadow-xl dark:border-strokedark dark:bg-boxdark dark:text-bodydark"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">選択</h3>
                <button
                  onClick={() => setActiveDropdownIndex(null)}
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
              <div className="space-y-3">
                {premiumOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center justify-between border-b border-stroke py-2 dark:border-b-strokedark ${
                      option.type !== 'dropdown'
                        ? 'hover:bg-gray-50 cursor-pointer dark:hover:bg-meta-4'
                        : ''
                    }`}
                    onClick={() => {
                      if (
                        option.type !== 'dropdown' &&
                        activeDropdownIndex !== null
                      ) {
                        const currentValue = scheduleData[activeDropdownIndex]
                          ?.scheduleInfo[option.value] as boolean;
                        handleInputChange(
                          activeDropdownIndex,
                          option.value as keyof ParentScheduleEntry,
                          !currentValue
                        );
                      }
                    }}
                  >
                    <span className="text-sm">{option.label}</span>
                    <div className="flex items-center">
                      {option.type === 'dropdown' ? (
                        <select
                          value={
                            (scheduleData[activeDropdownIndex]?.scheduleInfo[
                              option.value
                            ] as string) || ''
                          }
                          onChange={(e) => {
                            if (activeDropdownIndex !== null) {
                              handleInputChange(
                                activeDropdownIndex,
                                option.value as keyof ParentScheduleEntry,
                                e.target.value
                              );
                            }
                          }}
                          className="ml-4 rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark dark:bg-boxdark"
                        >
                          {option.value !== 'supportType' && (
                            <option value="">選択</option>
                          )}
                          {option.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="checkbox"
                          checked={
                            scheduleData[activeDropdownIndex]?.scheduleInfo[
                              option.value
                            ] as boolean
                          }
                          onChange={(e) => {
                            if (activeDropdownIndex !== null) {
                              handleInputChange(
                                activeDropdownIndex,
                                option.value as keyof ParentScheduleEntry,
                                e.target.checked
                              );
                            }
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent double-triggering
                          className="ml-4 h-5 w-5"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end p-4">
              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => setActiveDropdownIndex(null)}
              >
                完了
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default ScheduleStats;
