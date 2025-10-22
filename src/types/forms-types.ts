import type Stripe from 'stripe'
import type { ClientInfoList } from './clients-types'

export interface CreateSubscriptionFormProps {
	organizationIdPromise: Promise<string | null>
	clientsPromise: Promise<ClientInfoList[]>
	productsPromise?: Promise<Stripe.Product[]>
}
