import React from 'react';

const ServiceTimeTable: React.FC = () => {
  return (
    <table className="w-full border-collapse border border-stroke dark:border-strokedark">
      <thead>
        <tr>
          <th
            rowSpan={2}
            className="border border-stroke p-2 dark:border-strokedark"
          >
            契約支給量
          </th>
          <th className="border border-stroke p-2 dark:border-strokedark">
            月
          </th>
          <th className="border border-stroke p-2 dark:border-strokedark">
            火
          </th>
          <th className="border border-stroke p-2 dark:border-strokedark">
            水
          </th>
          <th className="border border-stroke p-2 dark:border-strokedark">
            木
          </th>
          <th className="border border-stroke p-2 dark:border-strokedark">
            金
          </th>
          <th className="border border-stroke p-2 dark:border-strokedark">
            土
          </th>
        </tr>
        <tr>
          <td className="border border-stroke p-2 dark:border-strokedark">
            <div>学校登校日</div>
            <div>学校休校日</div>
          </td>
          <td className="border border-stroke p-2 dark:border-strokedark">
            <div>15:00-16:30</div>
            <div>12:00-16:30</div>
          </td>
          <td className="border border-stroke p-2 dark:border-strokedark">
            <div>15:00-18:00</div>
            <div>12:00-17:00</div>
          </td>
          <td className="border border-stroke p-2 dark:border-strokedark">
            <div>15:00-18:00</div>
            <div>12:00-17:00</div>
          </td>
          <td className="border border-stroke p-2 dark:border-strokedark">
            <div>15:00-18:00</div>
            <div>12:00-17:00</div>
          </td>
          <td className="border border-stroke p-2 dark:border-strokedark">
            <div>-</div>
            <div>-</div>
          </td>
        </tr>
      </thead>
    </table>
  );
};

export default ServiceTimeTable;
