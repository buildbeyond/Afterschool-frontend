import React from 'react';
import CheckMark from '../../components/CheckMarks/CheckMark';

interface ScheduleTableProps {
  scheduleData: ScheduleEntry[];
  onChange: (newSchedule: ScheduleEntry[]) => void;
  disabled?: boolean;
}

interface ScheduleEntry {
  date: string;
  day: string;
  isHoliday: boolean;
  plannedStart: string;
  plannedEnd: string;
  plannedPickup: boolean;
  plannedPickupLocation: LocationType;
  plannedReturn: boolean;
  plannedReturnLocation: LocationType;
  beAbsent: boolean;
  lunch: boolean;
  dinner: boolean;
  notes?: string;
  additionalUse: boolean;
}

type LocationType = '学校' | '自宅' | 'その他';

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  scheduleData,
  onChange,
  disabled = false,
}) => {
  const handleInputChange = (
    index: number,
    field: keyof ScheduleEntry,
    value: string | boolean
  ) => {
    const newScheduleData = [...scheduleData];
    newScheduleData[index] = {
      ...newScheduleData[index],
      [field]: value,
    };
    onChange(newScheduleData);
  };
  const handleTimeChange = (
    index: number,
    field: keyof ScheduleEntry,
    value: string
  ) => {
    handleInputChange(index, field, value);
  };

  const locationOptions = ['学校', '自宅', 'その他'] as const;

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-x-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <table className="w-full min-w-[1000px] table-auto">
        <thead className="sticky top-0 z-10">
          <tr className="border-b border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
            <th className="p-2.5 text-center text-sm font-medium">日付</th>
            <th className="p-2.5 text-center text-sm font-medium">休</th>
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

            <th className="p-2.5 text-center text-sm font-medium">
              追加利用
              <br />
              希望
            </th>
            <th className="p-2.5 text-center text-sm font-medium">昼食</th>
            <th className="border-r border-stroke p-2.5 text-center text-sm font-medium dark:border-strokedark">
              夕食
            </th>
            <th className="p-2.5 text-center text-sm font-medium">備考</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stroke dark:divide-strokedark">
          {scheduleData.map((entry, index) => (
            <tr
              key={index}
              className={`${
                entry.day === '土'
                  ? 'bg-blue-50 dark:bg-blue-900/10'
                  : entry.day === '日'
                  ? 'bg-pink-50 dark:bg-pink-900/10'
                  : 'bg-white dark:bg-boxdark'
              }`}
            >
              <td className="p-2.5 text-center">
                <span className="text-sm">
                  {entry.date}({entry.day})
                </span>
              </td>
              <td className="p-2.5 text-center">
                {disabled ? (
                  entry.isHoliday && <CheckMark />
                ) : (
                  <input
                    type="checkbox"
                    checked={entry.isHoliday}
                    onChange={(e) =>
                      handleInputChange(index, 'isHoliday', e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                )}
              </td>
              <td
                colSpan={4}
                className="border-l border-r border-stroke dark:border-strokedark"
              >
                <div className="grid min-w-max grid-cols-4">
                  <div className="col-span-2 flex items-center gap-2 border-r border-stroke p-2.5 dark:border-strokedark">
                    <input
                      type="time"
                      value={entry.plannedStart}
                      onChange={(e) =>
                        handleTimeChange(index, 'plannedStart', e.target.value)
                      }
                      className="h-10 w-25 rounded border border-stroke bg-transparent px-2 dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                      disabled={disabled}
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={entry.plannedEnd}
                      onChange={(e) =>
                        handleTimeChange(index, 'plannedEnd', e.target.value)
                      }
                      className="h-10 w-25 rounded border border-stroke bg-transparent px-2 dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                      disabled={disabled}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    {disabled ? (
                      entry.plannedPickup ? (
                        <CheckMark />
                      ) : (
                        <div className="min-w-[25px]"></div>
                      )
                    ) : (
                      <input
                        type="checkbox"
                        checked={entry.plannedPickup}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            'plannedPickup',
                            e.target.checked
                          )
                        }
                        className="h-4 w-4"
                      />
                    )}
                    {disabled ? (
                      <input
                        type="input"
                        value={entry.plannedPickupLocation}
                        className="w-20 rounded border border-stroke bg-transparent px-1 py-0.5 text-sm dark:border-strokedark"
                        disabled
                      />
                    ) : (
                      <select
                        value={entry.plannedPickupLocation}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            'plannedPickupLocation',
                            e.target.value
                          )
                        }
                        className="w-20 rounded border border-stroke bg-transparent px-1 py-0.5 text-sm dark:border-strokedark"
                      >
                        {locationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-center gap-4">
                    {disabled ? (
                      entry.plannedReturn ? (
                        <CheckMark />
                      ) : (
                        <div className="min-w-[25px]"></div>
                      )
                    ) : (
                      <input
                        type="checkbox"
                        checked={entry.plannedReturn}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            'plannedReturn',
                            e.target.checked
                          )
                        }
                        className="h-4 w-4"
                      />
                    )}
                    {disabled ? (
                      <input
                        type="input"
                        value={entry.plannedReturnLocation}
                        disabled
                        className="w-20 rounded border border-stroke bg-transparent px-1 py-0.5 text-sm dark:border-strokedark"
                      />
                    ) : (
                      <select
                        value={entry.plannedReturnLocation}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            'plannedReturnLocation',
                            e.target.value
                          )
                        }
                        className="w-20 rounded border border-stroke bg-transparent px-1 py-0.5 text-sm dark:border-strokedark"
                      >
                        {locationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </td>
              <td className="p-2.5 text-center">
                {disabled ? (
                  entry.additionalUse && <CheckMark />
                ) : (
                  <input
                    type="checkbox"
                    checked={entry.additionalUse}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'additionalUse',
                        e.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />
                )}
              </td>
              <td className="p-2.5 text-center">
                {disabled ? (
                  entry.lunch && <CheckMark />
                ) : (
                  <input
                    type="checkbox"
                    checked={entry.lunch}
                    onChange={(e) =>
                      handleInputChange(index, 'lunch', e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                )}
              </td>
              <td className="border-r border-stroke p-2.5 text-center dark:border-strokedark">
                {disabled ? (
                  entry.dinner && <CheckMark />
                ) : (
                  <input
                    type="checkbox"
                    checked={entry.dinner}
                    onChange={(e) =>
                      handleInputChange(index, 'dinner', e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                )}
              </td>
              <td className="p-2.5">
                <input
                  type="text"
                  value={entry.notes || ''}
                  onChange={(e) =>
                    handleInputChange(index, 'notes', e.target.value)
                  }
                  className="w-full rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                  disabled={disabled}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
export type { ScheduleEntry };
