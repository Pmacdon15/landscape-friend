'use client';

import React, { useState } from 'react';
import FormHeader from '@/components/ui/header/form-header'; // Import FormHeader
import { CreateQuoteForm } from '@/components/ui/stripe-forms/stripe-quote-form/create-quote-form';
import { CreateSubscriptionForm } from '@/components/ui/stripe-forms/stripe-subscription-form/create-subscription-form';
import BackToLink from '../links/back-to-link';
import { ClientInfoList } from '@/types/clients-types';

interface FormSelectorProps {
  organizationId: string;
  clientsPromise: Promise<ClientInfoList[]>
}

export const FormSelector: React.FC<FormSelectorProps> = ({ organizationId, clientsPromise }) => {
  const [formType, setFormType] = useState<'quote' | 'subscription'>('quote');

  return (
    <>
      <FormHeader text={formType === 'quote' ? 'Create Stripe Quote' : 'Create Stripe Subscription'} />
      <div className="mb-4 flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${formType === 'quote' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setFormType('quote')}
        >
          Create Quote
        </button>
        <button
          className={`px-4 py-2 rounded-md ${formType === 'subscription' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setFormType('subscription')}
        >
          Create Subscription
        </button>
      </div>
      <div className="p-4 border rounded-md shadow-sm">
        {/* TODO:Wrap in suspense */}
        {formType === 'quote' ? (
          <CreateQuoteForm organizationId={organizationId} clientsPromise={clientsPromise} />
        ) : (
          <CreateSubscriptionForm organizationId={organizationId} clientsPromise={clientsPromise} />
        )}
      </div>
      <BackToLink path={'/billing/manage/quotes'} place={'Quotes'} />
    </>
  );
};
