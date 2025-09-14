'use client';
import React, { Suspense, useState } from 'react';
import FormHeader from '@/components/ui/header/form-header'; // Import FormHeader
import { CreateQuoteForm } from '@/components/ui/stripe-forms/stripe-quote-form/create-quote-form';
import { CreateSubscriptionForm } from '@/components/ui/stripe-forms/stripe-subscription-form/create-subscription-form';
import BackToLink from '../links/back-to-link';
import { CreateSubscriptionFormProps } from '@/types/forms-types';
import { CreateQuoteFormFallback } from '../fallbacks/quotes/create-quote-form-fallback';
import CreateSubscriptionFormFallback from '../fallbacks/quotes/create-subscription-form-fallback';



export const FormSelector: React.FC<CreateSubscriptionFormProps> = ({ organizationIdPromise, clientsPromise, productsPromise }) => {
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
        {formType === 'quote' ?
          <Suspense fallback={<CreateQuoteFormFallback />}>
            <CreateQuoteForm organizationIdPromise={organizationIdPromise} clientsPromise={clientsPromise} productsPromise={productsPromise} />
          </Suspense>
          :
          <Suspense fallback={<CreateSubscriptionFormFallback />}>
            <CreateSubscriptionForm organizationIdPromise={organizationIdPromise} clientsPromise={clientsPromise} />
          </Suspense>
        }
      </div>
      <BackToLink path={'/billing/manage/quotes'} place={'Quotes'} />
    </>
  );
};
