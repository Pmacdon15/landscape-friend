import { serve } from 'inngest/next'
import { functions } from '@/lib/inngest/functions'
import { inngest } from '@/lib/inngest/inngest'

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: functions,
})
