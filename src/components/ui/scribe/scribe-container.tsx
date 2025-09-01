'use client'
import { useState } from "react";
import FormHeader from "../header/form-header";

export default function ScribeContainer({ children, text }: { children: React.ReactNode, text: string }) {
  const [showDocs, setShowDocs] = useState(false)
  return (
    <div className="flex flex-col p-4 gap-4 border rounded-sm">
      <button onClick={() => setShowDocs(!showDocs)}>
        <FormHeader text={text} >Click to Expand</FormHeader>
      </button>
      <div className={`transition-all duration-300 ${showDocs ? "block opacity-100" : "hidden opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}