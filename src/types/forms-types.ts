import Stripe from 'stripe'
import { ClientInfoList } from './clients-types'

export interface CreateSubscriptionFormProps {
	organizationIdPromise: Promise<string | null>
	clientsPromise: Promise<ClientInfoList[]>
	productsPromise?: Promise<Stripe.Product[]>
}
