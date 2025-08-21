'use client'
import { addNovuSubscriber } from '@/lib/novu';
import { v4 as uuidv4 } from 'uuid';
export default function TestAddNovuSubButton() {
    const subscriberId = uuidv4();
    return (
        <button onClick={() => { addNovuSubscriber('pmacdonald15@gmail.com', 'Patrick MacDonald') }}>Test </button>
    );
}