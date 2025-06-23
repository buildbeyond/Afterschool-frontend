import flatpickr from 'flatpickr';
import { Japanese } from 'flatpickr/dist/l10n/ja.js';
import { useEffect } from 'react';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/plugins/monthSelect/style.css';
import useColorMode from '../../../hooks/useColorMode';
interface DatePickerJpProps {
  selectedDate: Date;
  isMonthSelector?: boolean;
  onDateChange: (date: Date) => void;
}

const DatePickerJp: React.FC<DatePickerJpProps> = ({
  selectedDate,
  isMonthSelector = false,
  onDateChange,
}) => {
  const [colorMode, setColorMode] = useColorMode();
  useEffect(() => {
    const picker = flatpickr('.form-datepicker', {
      mode: 'single',
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'Y年m月d日(D)',
      locale: Japanese,
      defaultDate: selectedDate,
      plugins: isMonthSelector
        ? [
            monthSelectPlugin({
              shorthand: true,
              dateFormat: 'Y年m月',
              altFormat: 'Y年m月',
              theme: colorMode as string,
            }),
          ]
        : [],
      onChange: ([date]) => {
        onDateChange(date);
      },
    }) as flatpickr.Instance;

    return () => {
      picker.destroy();
    };
  }, [selectedDate]);

  return (
    <div className="relative">
      <input
        className="form-datepicker w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        placeholder="YYYY年MM月DD日"
        data-class="flatpickr-right"
      />
    </div>
  );
};

export default DatePickerJp;
