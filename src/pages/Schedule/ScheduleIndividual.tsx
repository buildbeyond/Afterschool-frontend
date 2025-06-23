import React, { useState, useEffect } from 'react';
import ScheduleTable from '../Tables/ScheduleTable';
import { ScheduleEntry } from '../Tables/ScheduleTable';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { scheduleApi } from '../../services/api';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DatePickerJp from '../../components/Forms/DatePicker/DatePickerJp';

const ScheduleIndividual: React.FC = () => {
  const { userId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const year = params.get('year');
  const month = params.get('month');

  let currentDate = new Date();
  if (year && month) {
    currentDate = new Date(parseInt(year), parseInt(month));
  }

  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const navigate = useNavigate();

  const handleScheduleChange = (newSchedule: ScheduleEntry[]) => {
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
        isHoliday: false,
        beAbsent: false,
        plannedStart: '',
        plannedEnd: '',
        plannedPickup: false,
        plannedReturn: false,
        plannedPickupLocation: '',
        plannedReturnLocation: '',
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

      try {
        const currentMonth = selectedDate.getMonth() + 1 + '';
        const currentYear = selectedDate.getFullYear() + '';
        const response = await scheduleApi.getIndividualSchedule(
          currentMonth,
          currentYear,
          userId
        );
        if (response.schedule) {
          if (response.schedule.user) {
            setCurrentUser(response.schedule.user.username);
          }
          if (response.schedule.entries) {
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

  useEffect(() => {
    loadSchedule();
  }, [selectedDate, userId]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="スケジュール入力" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <div className="flex items-center gap-2">
            <button
              className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 p-1 text-base text-slate-400"
              onClick={() => navigate('/schedule/stats')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="800px"
                height="800px"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 10L8 14L6 14L-2.62268e-07 8L6 2L8 2L8 6L16 6L16 10L8 10Z"
                  fill="rgb(148, 163, 184)"
                />
              </svg>
            </button>
            <div className="flex items-center gap-x-4">
              <DatePickerJp
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                isMonthSelector={true}
              />
              <h3 className="font-medium text-black dark:text-white">
                {currentUser}さんのスケジュール
              </h3>
            </div>
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
                disabled={true}
                showAchievements
              />
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ScheduleIndividual;
