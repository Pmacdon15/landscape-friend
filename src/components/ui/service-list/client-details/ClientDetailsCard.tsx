import React, { Suspense } from 'react';
import ClientName from './ClientName';
import ClientPhoneNumber from './ClientPhoneNumber';
import ClientEmail from './ClientEmail';
import ClientAddress from './ClientAddress';
import { Client } from '@/types/clients-types';
import MapComponent from '../../map-component/map-component';
import ImageList from '../../image-list/image-list';
import MarkYardServiced from '../../buttons/mark-yard-serviced';
import FormHeader from '../../header/form-header';

interface ClientDetailsCardProps {
  client: Client;
  isAdmin: boolean;
  searchTermIsServiced: boolean;
  serviceDate?: Date;
  snow: boolean;
}

const ClientDetailsCard: React.FC<ClientDetailsCardProps> = ({ client, isAdmin, searchTermIsServiced, serviceDate, snow }) => {
  return (
    <>
      <div className="flex flex-col items-center w-full">
        <ClientName fullName={client.full_name} />
        <ClientPhoneNumber phoneNumber={client.phone_number} />
        <ClientEmail client={client} />
        <ClientAddress address={client.address} />
      </div>

      <div className="flex flex-col sm:flex-row gap-1">
        <Suspense fallback={<FormHeader text="Loading..." />}>
          <MapComponent address={client.address} />
        </Suspense>
        <ImageList isAdmin={isAdmin} client={client} />
      </div>
    </>
  );
};

export default ClientDetailsCard;