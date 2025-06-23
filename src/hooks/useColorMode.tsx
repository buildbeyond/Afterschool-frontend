import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light');

  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;

    colorMode === 'dark'
      ? (bodyClass.add(className),
        document.querySelectorAll('.flatpickr-calendar').forEach((e) => {
          e.classList.add('flatpickr-monthSelect-theme-dark');
        }))
      : (bodyClass.remove(className),
        document.querySelectorAll('.flatpickr-calendar').forEach((e) => {
          e.classList.remove('flatpickr-monthSelect-theme-dark');
        }));
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
