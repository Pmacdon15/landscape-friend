import { Button } from '@/components/ui/button';
import FormContainer from '@/components/ui/containers/form-container';
import FormHeader from '@/components/ui/header/form-header';
import Link from 'next/link';

export default function NotFound() {
  return (
    <FormContainer >
      <FormHeader text="Not Found" />
      <FormHeader>Could not find requested resource</FormHeader>
      <Link className="mx-auto" href="/"><Button variant={"outline"}>Return Home</Button></Link>
    </FormContainer>
  );
}
