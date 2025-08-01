import React, { useState, useEffect } from 'react';
import ScheduleTable from '../Tables/ScheduleTable';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { scheduleApi } from '../../services/api';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DatePickerJp from '../../components/Forms/DatePicker/DatePickerJp';
import { ParentScheduleEntry } from '../../types';

const premiumOptions: {
  label: string;
  type?: 'checkbox' | 'dropdown';
  options?: { value: string; label: string }[];
  value: keyof ParentScheduleEntry;
}[] = [
  {
    label: '提供形態',
    value: 'supportType',
    type: 'dropdown',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
    ],
  },
  {
    label: '家族支援加算',
    value: 'familySupport',
    type: 'dropdown',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ],
  },
  {
    label: '医療連携体制加算',
    value: 'medicalSupport',
  },
  {
    label: '延長支援加算',
    value: 'extendedSupport',
    type: 'dropdown',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
    ],
  },
  {
    label: '集中的支援加算',
    value: 'concentratedSupport',
  },
  {
    label: '専門的支援加算（支援実施時）',
    value: 'specializedSupport',
  },
  {
    label: '通所自立支援加算',
    value: 'communitySupport',
  },
  {
    label: '入浴支援加算',
    value: 'bathSupport',
  },
  {
    label: '子育てサポート加算',
    value: 'childCareSupport',
  },
  {
    label: '自立サポート加算',
    value: 'selfSupport',
  },
  {
    label: '保護者等確認欄',
    value: 'guardianConfirmation',
  },
];

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
  const [scheduleData, setScheduleData] = useState<ParentScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  const navigate = useNavigate();

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
        isHoliday: false,
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
        setCurrentUser(error.response.data.username);

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
      setIsLoading(true);
      const month = (selectedDate.getMonth() + 1).toString();
      const year = selectedDate.getFullYear().toString();
      await scheduleApi.submitScheduleStats(scheduleData, userId, year, month);
      toast.success('スケジュール提出成功');
    } catch (error) {
      console.error('スケジュール提出エラー:', error);
      toast.error('スケジュール提出に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const month = (selectedDate.getMonth() + 1).toString();
      const year = selectedDate.getFullYear().toString();
      const user = userId;
      const data = await scheduleApi.downloadReportData(month, year, user);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `実績-${currentUser}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [selectedDate, userId]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="個別スケジュール" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between gap-y-4 border-b border-stroke px-6.5 py-4 dark:border-strokedark max-md:flex-col">
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
            <div className="flex items-center gap-x-4 max-xsm:flex-col max-xsm:gap-y-4">
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
          <div className="flex items-center gap-2 max-md:justify-around">
            {/** Submit button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              入力反映
            </button>
            <button
              className="inline-flex items-center gap-2 rounded bg-primary px-2 py-2 font-medium text-white hover:bg-opacity-90"
              onClick={handleDownload}
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
