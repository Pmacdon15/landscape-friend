import type { Price } from '@/types/clients-types'
import { InputDiv } from '../containers/input-dev'
import { InputField } from '../inputs/input'
import { SettingsLabel } from './settings-label'

export default async function PricePerCutInput({
	pricePerCutPromise,
}: {
	pricePerCutPromise: Promise<Price | null>
}) {
	const pricePerCut = (await pricePerCutPromise)?.price
	return (
		<InputDiv>
			<SettingsLabel text="Price Per Cut" />
			<InputField
				defaultValue={pricePerCut || 0.0}
				name={'price_pre_cut'}
				step={0.01}
				type={'number'}
			/>
		</InputDiv>
	)
}
