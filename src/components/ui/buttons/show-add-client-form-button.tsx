import { Props } from '@/types/types-params';
import React from 'react';

export default function ShowAddClientFormButton({ showForm, setShowForm }: Props) {
  return (
    <button
      className={`ml-auto border h-9 px-4 py-2 has-[>svg]:px-3 rounded-sm ${!showForm ? "bg-background hover:bg-background/60" : "bg-red-400 hover:bg-red-300"}  shadow-lg`}
      onClick={() => setShowForm(prev => !prev)}
    >
      {!showForm ? "Add Client" : "Cancel"}
    </button>
  );
}