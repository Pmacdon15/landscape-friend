import ContentContainer from "../containers/content-container";
import MapComponent from "../map-component/map-component";
import DeleteClientButton from "../buttons/delete-client-button";
import { PaginationTabs } from "../pagination/pagination-tabs";
import { CuttingWeekDropDownContainer } from "../cutting-week/cutting-week";
import { Client, ClientListServiceProps } from "@/types/types";
import { Suspense } from "react";
import Link from "next/link";
import { ClientEmailPopover } from '@/components/ui/popovers/client-email-popover'
import FormContainer from "../containers/form-container";
import FormHeader from "../header/form-header";
import SnowClientInput from "../inputs/snow-client-input";
import SnowClientInputFallback from "../fallbacks/snow-client-input-fallback";
import PricePerUpdateInput from "./price-per-update-input";
import SampleData from "@/app/sampleData.json";
import AddClientFormClientComponent from "@/components/ui/client-list/add-client-form-client-component";
import { AddClientFormServerComponent } from "@/components/ui/client-list/add-client-form-server-component";
import Image from "next/image";

// This is a demo component explicitly for testing the updated ui

// TODO update sample data to reflect the original client interface

/**
sequential animation example

const elements = document.querySelectorAll('.animate-sequence');
let index = 0;

function playNext() {
  if (index < elements.length) {
    const el = elements[index];
    el.classList.add('your-animation-class');
    el.addEventListener('animationend', () => {
      el.classList.remove('your-animation-class');
      index++;
      playNext();
    }, { once: true });
  }
}

playNext();
 */

export interface SampleClient {
  id: number;
  full_name: string;
  phone_number: string;
  email_address: string;
  address: string;
  price_per_cut: number;
}

export default async function ClientListService({
  clientListPage,  
  isAdmin
}: ClientListServiceProps) {

  const clients : Client[] = SampleData;

  if (!clients) return <ContentContainer> <p>Error Loading clients</p> </ContentContainer>

  if (clients.length < 1) return <ContentContainer> <p>Please add clients</p> </ContentContainer>

  return (
    <>
      <PaginationTabs path="/lists/client" clientListPage={clientListPage} totalPages={10} />
      <ul className="flex flex-col gap-4 rounded-sm w-full items-center justify-center">
        {clients.map((client: Client) => (
          <FormContainer key={client.id}>
            <li className="border p-4 rounded-sm relative bg-white/70">
              {isAdmin &&
                <div className="absolute top-1 right-1">
                  <DeleteClientButton clientId={client.id} />
                </div>}
              <FormHeader text={client.full_name} />
              <div className="flex flex-col gap-4 items-center justify-center mt-8 mb-8 md:flex-row sm:flex-col lg:flex-row">

                <div className="flex flex-row gap-2 items-center md:text-xl md:flex-col sm:text-sm">
                  <Image
                    src="/client-list/telephone.png"
                    alt="Phone Icon"
                    className="w-12 h-12 mb-4 md:w-24 md:h-24 sm:w-12 sm:h-12"
                    width={512}
                    height={512}
                    />
                    <p className="flex flex-col md:text-xl sm:flex-row text-sm">
                      <Link className="cursor-pointer text-blue-600 hover:underline md:text-xl sm:text-sm" href={`tel:${client.phone_number}`}>
                        {client.phone_number}
                      </Link>
                    </p>
                </div>
                
                <div className="flex flex-row gap-2 items-center md:text-xl md:flex-col sm:text-sm">
                  <Image
                    src="/client-list/email.png"
                    alt="Email Icon"
                    className="w-12 h-12 mb-4 md:w-24 md:h-24 sm:w-12 sm:h-12"
                    width={512}
                    height={512}
                    />
                  <div className="md:text-xl sm:text-sm">
                    <ClientEmailPopover client={client} />
                  </div>
                </div>
                
                <div className="flex flex-row gap-2 items-center md:text-xl md:flex-col sm:text-sm">
                  <Image
                    src="/client-list/address.png"
                    alt="Email Icon"
                    className="w-12 h-12 mb-4 md:w-24 md:h-24 sm:w-12 sm:h-12"
                    width={512}
                    height={512}
                    />
                  <p className="md:text-xl sm:text-sm">{client.address}</p>
                </div>
                

              </div>
              
              
              {isAdmin && 
                <div className="flex flex-col items-center justify-center mb-8">
                   <AddClientFormClientComponent>
                     <AddClientFormServerComponent />
                   </AddClientFormClientComponent>
                </div>
              }

                <div className="flex flex-col items-center justify-center mb-8">
                  <Suspense fallback={<SnowClientInputFallback />}>
                    {/*<SnowClientInput client={client} orgMembersPromise={client.organization_id} />*/}
                  </Suspense>
                  <div className="flex flex-col items-center justify-center mb-4 md:flex-row">
                    <PricePerUpdateInput client={client} />
                    <p className="md:text-xl sm: text-l">Amount owing: ${client.amount_owing} </p>
                  </div>
                  <CuttingWeekDropDownContainer isAdmin={isAdmin} client={client} />
                </div>
              
              

              <Suspense fallback={<FormHeader text="Loading..." />}>
                <MapComponent address={client.address} />
              </Suspense>
            </li>
          </FormContainer>
        ))}
      </ul >
      <PaginationTabs path="/lists/client" clientListPage={clientListPage} totalPages={10} />
    </>
  );
}