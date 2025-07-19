'use client'
import { useState } from "react";
import ContentContainer from "../containers/content-container";
import ShowAddClientFormButton from "../buttons/show-add-client-form-button";

export default function AddClientFormClientComponent({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [showForm, setShowForm] = useState(false)
    return (
        <ContentContainer>
            <div className="flex flex-col gap-4">
                {showForm && children}
                <ShowAddClientFormButton showForm={showForm} setShowForm={setShowForm} />
            </div>
        </ContentContainer>
    );
}