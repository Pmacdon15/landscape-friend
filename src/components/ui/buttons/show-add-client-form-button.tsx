import React from 'react';

interface Props {
  showForm: boolean;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShowAddClientFormButton({ showForm, setShowForm }: Props) {
  return (
    <button
      className={`ml-auto border p-2 rounded-sm ${!showForm ? "bg-backGround hover:bg-background/60" : "bg-red-400 hover:bg-red-300"}  shadow-lg`}
      onClick={() => setShowForm(prev => !prev)}
    >
      {!showForm ? "Add Client" : "Cancel"}
    </button>
  );
}