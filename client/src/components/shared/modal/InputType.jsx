import React from 'react';

const InputType = ({ labelText, labelFor, inputType, value, onChange, className }) => {
  return (
    <div className="mb-4">
      <label htmlFor={labelFor} className="block text-gray-700 font-medium mb-2">
        {labelText}
      </label>
      <input
        id={labelFor}
        type={inputType}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />
    </div>
  );
};

export default InputType;
