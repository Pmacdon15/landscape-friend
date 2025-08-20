'use client'
import { Alert } from '@/components/ui/alerts/alert'
import { useDeleteSiteMap } from '@/mutations/mutations';
export default function DeleteSiteMapButton({ clientId, siteMapId }: { clientId: number, siteMapId: number }) {
  const { mutate } = useDeleteSiteMap();
  return (
    <div className="absolute bottom-5 right-5">
      <Alert variant={"remove-sitemap"} text={"Remove Image"} functionAction={() => mutate({ clientId, siteMapId })} />
    </div>
  );
}


