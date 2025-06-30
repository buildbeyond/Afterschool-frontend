import React, { useState } from 'react';
import CheckMark from '../../components/CheckMarks/CheckMark';
import SelectWithInput from '../../components/SelectWithInput';
import {
  locationOptions,
  ParentScheduleEntry,
  premiumOptions,
} from '../../types';

interface ScheduleTableProps {
  scheduleData: ParentScheduleEntry[];
  onChange: (newSchedule: ParentScheduleEntry[]) => void;
  disabled?: boolean;
  showAchievements?: boolean;
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({
  scheduleData,
  onChange,
  disabled = false,
  showAchievements = false,
}) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(
    null
  );
  const handleInputChange = (
    index: number,
    field: keyof ParentScheduleEntry,
    value: string | boolean
  ) => {
    const newScheduleData = [...scheduleData];
    newScheduleData[index] = {
      ...newScheduleData[index],
      [field]: value,
      ...(field === 'wasPresent' && { wasAbsent: false }),
      ...(field === 'wasAbsent' && { wasPresent: false }),
    };
    onChange(newScheduleData);
  };
  const handleTimeChange = (
    index: number,
    field: keyof ParentScheduleEntry,
    value: string
  ) => {
    handleInputChange(index, field, value);
  };

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-x-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <table className="w-full min-w-[1000px] table-auto">
        <thead className="sticky top-0 z-10">
          <tr className="border-b border-stroke bg-gray-2 dark:border-strokedark dark:bg-meta-4">
            <th className="p-2.5 text-center text-sm font-medium">日付</th>
            <th className="p-2.5 text-center text-sm font-medium">休</th>
            {showAchievements && (
              <>
                <th className="p-2.5 text-center">
                  <h5 className="text-sm font-medium">出欠</h5>
                </th>
                <th className="p-2.5 text-center">
                  <h5 className="text-sm font-medium">欠席</h5>
                </th>
              </>
            )}
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

            {showAchievements && (
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
            )}

            <th className="p-2.5 text-center text-sm font-medium">
              <div className="min-w-max">
                追加利用
                <br />
                希望
              </div>
            </th>
            {showAchievements && (
              <th className="p-2.5 text-center">
                <h5 className="text-sm font-medium">おやつ</h5>
              </th>
            )}
            <th className="p-2.5 text-center text-sm font-medium">昼食</th>
            <th className="border-r border-stroke p-2.5 text-center text-sm font-medium dark:border-strokedark">
              夕食
            </th>
            {showAchievements && (
              <th className="p-2.5 text-center">
                <h5 className="text-sm font-medium">入力</h5>
              </th>
            )}
            <th className="p-2.5 text-center text-sm font-medium">備考</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stroke dark:divide-strokedark">
          {scheduleData.map((entry, index) => {
            const isRowDisabled = entry.wasAbsent || entry.isHoliday;
            return (
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
                <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                  <div className="flex min-w-max items-center justify-center">
                    {disabled ? (
                      entry.isHoliday && <CheckMark />
                    ) : (
                      <input
                        type="checkbox"
                        checked={entry.isHoliday}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            'isHoliday',
                            e.target.checked
                          )
                        }
                        className="h-4 w-4"
                      />
                    )}
                  </div>
                </td>
                {showAchievements && (
                  <>
                    <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                      <div className="flex min-w-max items-center justify-center">
                        {!entry.isHoliday ? (
                          <input
                            type="checkbox"
                            checked={entry.wasPresent}
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
                          <input type="checkbox" disabled className="h-4 w-4" />
                        )}
                      </div>
                    </td>
                    <td className="border-stroke p-2.5 text-center dark:border-strokedark">
                      <div className="flex min-w-max items-center justify-center">
                        {!entry.isHoliday ? (
                          <input
                            type="checkbox"
                            checked={entry.wasAbsent}
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
                          <input type="checkbox" disabled className="h-4 w-4" />
                        )}
                      </div>
                    </td>
                  </>
                )}
                <td
                  colSpan={4}
                  className="border-l border-r border-stroke dark:border-strokedark"
                >
                  <div className="grid min-w-max grid-cols-4">
                    <div className="col-span-2 flex items-center justify-center gap-2 border-r border-stroke p-2.5 dark:border-strokedark">
                      {!isRowDisabled ? (
                        <input
                          type="time"
                          value={entry.plannedStart}
                          onChange={(e) =>
                            handleTimeChange(
                              index,
                              'plannedStart',
                              e.target.value
                            )
                          }
                          className="h-10 w-25 rounded border border-stroke bg-transparent px-2 dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                          disabled={disabled}
                        />
                      ) : (
                        <input
                          type="time"
                          value=""
                          className="h-10 w-25 rounded border border-stroke bg-transparent px-2 dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                          disabled
                        />
                      )}
                      <span>-</span>
                      {!isRowDisabled ? (
                        <input
                          type="time"
                          value={entry.plannedEnd}
                          onChange={(e) =>
                            handleTimeChange(
                              index,
                              'plannedEnd',
                              e.target.value
                            )
                          }
                          className="h-10 w-25 rounded border border-stroke bg-transparent px-2 dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                          disabled={disabled}
                        />
                      ) : (
                        <input
                          type="time"
                          value=""
                          className="h-10 w-25 rounded border border-stroke bg-transparent px-2 dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                          disabled
                        />
                      )}
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2 px-2">
                      {disabled ? (
                        entry.plannedPickup ? (
                          <CheckMark />
                        ) : (
                          <div className="min-w-[25px]"></div>
                        )
                      ) : !isRowDisabled ? (
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
                      ) : (
                        <input
                          type="checkbox"
                          checked={false}
                          className="h-4 w-4"
                          disabled
                        />
                      )}
                      {disabled ? (
                        <input
                          type="input"
                          title={entry.plannedPickupLocation}
                          value={entry.plannedPickupLocation}
                          className="w-20 rounded border border-stroke bg-transparent px-1 py-0.5 text-sm dark:border-strokedark"
                          disabled
                        />
                      ) : !isRowDisabled ? (
                        <SelectWithInput
                          options={locationOptions.map((v) => v)}
                          value={entry.plannedPickupLocation}
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
                          type="input"
                          value=""
                          className="w-24 rounded border border-stroke bg-transparent px-1 py-0.5 text-sm dark:border-strokedark"
                          disabled
                        />
                      )}
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2 px-2">
                      {disabled ? (
                        entry.plannedReturn ? (
                          <CheckMark />
                        ) : (
                          <div className="min-w-[25px]"></div>
                        )
                      ) : !isRowDisabled ? (
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
                      ) : (
                        <input
                          type="checkbox"
                          checked={false}
                          className="h-4 w-4"
                          disabled
                        />
                      )}
                      {disabled ? (
                        <input
                          type="input"
                          title={entry.plannedReturnLocation}
                          value={entry.plannedReturnLocation}
                          disabled
                          className="w-20 rounded border border-stroke bg-transparent px-1 py-0.5 text-sm dark:border-strokedark"
                        />
                      ) : !isRowDisabled ? (
                        <SelectWithInput
                          options={locationOptions.map((v) => v)}
                          value={entry.plannedReturnLocation}
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
                          type="input"
                          value=""
                          className="w-24 rounded border border-stroke bg-transparent px-1 py-0.5 text-sm dark:border-strokedark"
                          disabled
                        />
                      )}
                    </div>
                  </div>
                </td>
                {showAchievements && (
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
                          ) : (
                            <input
                              type="time"
                              value=""
                              className="w-23 rounded border border-stroke bg-transparent px-2 py-1 text-sm dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                              disabled
                            />
                          )}
                          <span>-</span>
                          {!isRowDisabled ? (
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
                          ) : (
                            <input
                              type="time"
                              value=""
                              className="w-23 rounded border border-stroke bg-transparent px-2 py-1 text-sm dark:border-strokedark [&::-webkit-calendar-picker-indicator]:hidden"
                              disabled
                            />
                          )}
                          {!isRowDisabled ? (
                            <select
                              value={entry.actualAmount}
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
                              type="input"
                              value=""
                              className="ml-4 w-15 rounded border border-stroke bg-transparent px-1 py-0.5 text-sm dark:border-strokedark"
                              disabled
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                <td className="p-2.5 text-center">
                  {disabled ? (
                    entry.additionalUse && <CheckMark />
                  ) : !isRowDisabled ? (
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
                  ) : (
                    <input
                      type="checkbox"
                      checked={false}
                      className="h-4 w-4"
                      disabled
                    />
                  )}
                </td>
                {showAchievements && (
                  <td className="p-2.5 text-center">
                    {!isRowDisabled ? (
                      <input
                        type="checkbox"
                        checked={entry.hadSnack}
                        onChange={(e) =>
                          handleInputChange(index, 'hadSnack', e.target.checked)
                        }
                        className="h-4 w-4"
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={false}
                        className="h-4 w-4"
                        disabled
                      />
                    )}
                  </td>
                )}
                <td className="p-2.5 text-center">
                  {disabled ? (
                    entry.lunch && <CheckMark />
                  ) : !isRowDisabled ? (
                    <input
                      type="checkbox"
                      checked={entry.lunch}
                      onChange={(e) =>
                        handleInputChange(index, 'lunch', e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={false}
                      className="h-4 w-4"
                      disabled
                    />
                  )}
                </td>
                <td className="border-r border-stroke p-2.5 text-center dark:border-strokedark">
                  {disabled ? (
                    entry.dinner && <CheckMark />
                  ) : !isRowDisabled ? (
                    <input
                      type="checkbox"
                      checked={entry.dinner}
                      onChange={(e) =>
                        handleInputChange(index, 'dinner', e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={false}
                      className="h-4 w-4"
                      disabled
                    />
                  )}
                </td>
                {showAchievements && (
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
                )}

                <td className="p-2.5">
                  {!isRowDisabled ? (
                    <input
                      type="text"
                      value={entry.remarks || ''}
                      onChange={(e) =>
                        handleInputChange(index, 'remarks', e.target.value)
                      }
                      className="w-full min-w-24 rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                    />
                  ) : (
                    <input
                      type="text"
                      value=""
                      className="w-full min-w-24 rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                      disabled
                    />
                  )}
                </td>
                {/* {showAchievements ? (
                <td className="p-2.5">
                  <input
                    type="text"
                    value={entry.remarks || ''}
                    onChange={(e) =>
                      handleInputChange(index, 'remarks', e.target.value)
                    }
                    className="w-full rounded border border-stroke bg-transparent px-2 py-1 dark:border-strokedark"
                    disabled={disabled}
                  />
                </td>
              ) : (
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
              )} */}
              </tr>
            );
          })}
        </tbody>
      </table>
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
                        const currentValue = scheduleData[
                          activeDropdownIndex
                        ]?.[option.value] as boolean;
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
                            (scheduleData[activeDropdownIndex]?.[
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
                            scheduleData[activeDropdownIndex]?.[
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
    </div>
  );
};

export default ScheduleTable;
