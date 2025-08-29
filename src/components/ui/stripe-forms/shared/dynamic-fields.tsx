'use client';
import React from 'react';
import { Control, FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from './input'; // adjust path if needed

type FieldWithId<T> = T & { id: string };

interface DynamicFieldsProps<T, TFieldValues extends FieldValues> {
  name: string; // "lines" or "materials"
  fields: FieldWithId<T>[];
  append: (item: T | T[]) => void;
  remove: (index: number) => void;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  control: Control<TFieldValues>;
  labels: { description: string; amount: string; quantity: string }; // customizable labels
  newItem: () => T;
}

export function DynamicFields<T extends { description?: string; amount?: number; quantity?: number; materialType?: string; materialCostPerUnit?: number; materialUnits?: number }, TFieldValues extends FieldValues>({
  name,
  fields,
  append,
  remove,
  register,
  errors,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  control,
  labels,
  newItem
}: DynamicFieldsProps<T, TFieldValues>) {
  return (
    <section>
      <h3 className="text-md font-semibold mb-2">{labels.description} Items</h3>
      {fields.map((item, index: number) => (
        <div key={item.id} className="border p-4 mb-4 rounded-md">
          {item.description !== undefined && (
            <InputField
              label={labels.description}
              id={`${name}.${index}.description`}
              type="text"
              register={register}
              errors={errors}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          )}
          {item.materialType !== undefined && (
            <InputField
              label={labels.description}
              id={`${name}.${index}.materialType`}
              type="text"
              register={register}
              errors={errors}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          )}

          <InputField
            label={labels.amount}
            id={`${name}.${index}.${item.amount !== undefined ? 'amount' : 'materialCostPerUnit'}`}
            type="number"
            register={register}
            errors={errors}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            min="0"
            step="0.01"
            valueAsNumber
          />

          <InputField
            label={labels.quantity}
            id={`${name}.${index}.${item.quantity !== undefined ? 'quantity' : 'materialUnits'}`}
            type="number"
            register={register}
            errors={errors}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            min="1"
            step="1"
            valueAsNumber
          />

          {fields.length > 1 && (
            <Button type="button" onClick={() => remove(index)} className="mt-2">
              Remove {labels.description} Item
            </Button>
          )}
        </div>
      ))}

      <Button
        type="button"
        onClick={() => append(newItem())}
        className="mt-2"
      >
        Add {labels.description} Item
      </Button>
    </section>
  );
}
