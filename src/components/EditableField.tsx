// components/EditableField.tsx
'use client';
import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface EditableFieldProps {
  label: string;
  fieldKey: string;
  value: string | string[] | undefined;
  onSave: (fieldKey: string, newValue: string | string[]) => void;
  type?: 'text' | 'array';
}

const EditableField = ({
  label,
  fieldKey,
  value,
  onSave,
  type = 'text',
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(
    type === 'array' ? (Array.isArray(value) ? value.join(', ') : '') : (value as string) || ''
  );

  const handleSave = () => {
    const finalValue = type === 'array' ? editedValue.split(',').map(v => v.trim()) : editedValue;
    onSave(fieldKey, finalValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(
      type === 'array' ? (Array.isArray(value) ? value.join(', ') : '') : (value as string) || ''
    );
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <>
            <input
              type="text"
              className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 w-full"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            />
            <button onClick={handleSave} className="text-green-500"><Check /></button>
            <button onClick={handleCancel} className="text-red-500"><X /></button>
          </>
        ) : (
          <>
            <p className="text-white">
              {type === 'array'
                ? Array.isArray(value)
                  ? value.join(', ')
                  : 'N/A'
                : value || 'N/A'}
            </p>
            <button onClick={() => setIsEditing(true)} className="text-blue-500"><Pencil size={16} /></button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditableField;
