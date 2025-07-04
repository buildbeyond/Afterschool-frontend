import React, { useState, useEffect } from 'react';
import ScheduleTable from '../Tables/ScheduleTable';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { scheduleApi } from '../../services/api';
import { toast } from 'react-toastify';
import DatePickerJp from '../../components/Forms/DatePicker/DatePickerJp';
import { ParentScheduleEntry } from '../../types';

const ScheduleInput: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleData, setScheduleData] = useState<ParentScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleScheduleChange = (newSchedule: ParentScheduleEntry[]) => {
    setScheduleData(newSchedule);
  };

  // Generate days for the current month
  const generateDaysForCurrentMonth = () => {
    const currentMonth = selectedDate.getMonth() + 1 + '';
    const currentYear = selectedDate.getFullYear() + '';
    const year = parseInt(currentYear);
    const month = parseInt(currentMonth) - 1; // JS months are 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayOfWeek = date.getDay();
      const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

      days.push({
        date: i.toString(),
        day: dayNames[dayOfWeek],
        isHoliday: dayOfWeek === 0 || dayOfWeek === 6, // Weekend
        plannedStart: dayOfWeek >= 1 && dayOfWeek <= 5 ? '09:00' : '', // Weekday default
        plannedEnd: dayOfWeek >= 1 && dayOfWeek <= 5 ? '17:00' : '', // Weekday default
        plannedPickup: dayOfWeek >= 1 && dayOfWeek <= 5, // Weekday default
        plannedReturn: dayOfWeek >= 1 && dayOfWeek <= 5, // Weekday default
        plannedPickupLocation: '学校',
        plannedReturnLocation: '学校',
        lunch: false,
        dinner: false,
      });
    }

    return days;
  };

  const loadSchedule = async () => {
    try {
      setIsLoading(true);
      // Always generate the full month of days first
      const allDays = generateDaysForCurrentMonth();
      const currentMonth = selectedDate.getMonth() + 1 + '';
      const currentYear = selectedDate.getFullYear() + '';

      try {
        const response = await scheduleApi.getSchedule(
          currentMonth,
          currentYear
        );
        if (response.schedule && response.schedule.entries) {
          // Create a map of existing entries by date for easy lookup
          const entriesMap = new Map();
          response.schedule.entries.forEach((entry) => {
            entriesMap.set(entry.date, entry);
          });

          // Merge existing data with the full month
          const mergedData = allDays.map((day) => {
            const existingEntry = entriesMap.get(day.date);
            return existingEntry ? existingEntry : day;
          });

          setScheduleData(mergedData);
        } else {
          // No schedule exists, use the generated days
          setScheduleData(allDays);
        }
      } catch (error) {
        console.error('Error loading schedule:', error);
        // If 404 or any other error, still show all days
        setScheduleData(allDays);

        // Only show error for non-404 responses
        if (!error.response || error.response.status !== 404) {
          toast.error('Failed to load schedule');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setScheduleData(generateDaysForCurrentMonth());
  }, []);

  const handleSubmit = async () => {
    try {
      const currentMonth = selectedDate.getMonth() + 1 + '';
      const currentYear = selectedDate.getFullYear() + '';
      setIsLoading(true);
      await scheduleApi.submitSchedule({
        month: currentMonth,
        year: currentYear,
        entries: scheduleData,
      });
      toast.success('スケジュール提出成功');
    } catch (error) {
      console.error('スケジュール提出エラー:', error);
      toast.error('スケジュール提出に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [selectedDate]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="スケジュール入力" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <div className="flex justify-between">
            <div className="flex items-center gap-x-4">
              <DatePickerJp
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                isMonthSelector={true}
              />
              <h3 className="font-medium text-black dark:text-white">
                スケジュール
              </h3>
            </div>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              スケジュール提出
            </button>
          </div>
        </div>

        <div className="p-6.5">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <p>スケジュール読み込み中...</p>
            </div>
          ) : (
            <>
              <ScheduleTable
                scheduleData={scheduleData}
                onChange={handleScheduleChange}
              />
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ScheduleInput;
