// Componentes para DatePicker y TimePicker que podrían faltar
export const DatePicker = ({ value, onChange }: any) => (
  <input type="date" value={value} onChange={onChange} className="w-full p-2 border rounded" />
);

export const TimePicker = ({ value, onChange }: any) => (
  <input type="time" value={value} onChange={onChange} className="w-full p-2 border rounded" />
);
