import type { Month } from '@/lib/enums/months'
import SettingsForm from '../forms/settings-form'
import { EditSettingSheet } from '../sheets/edit-settings-sheet'
import SettingsDisplayItem from './settings-display-item'

export default function DisplayWinterMonths({
	startingMonth,
	endingMonth,
}: {
	startingMonth: Month
	endingMonth: Month
}) {
	return (
		<SettingsDisplayItem
			actions={
				<EditSettingSheet
					prompt={'Edit Winter Months'}
					title="Edit Setting"
				>
					<SettingsForm>
						<h1>test</h1>
					</SettingsForm>
				</EditSettingSheet>
			}
			label="Winter Months"
		>
			<p>Starting: {startingMonth}</p>
			<p>Ending: {endingMonth}</p>
		</SettingsDisplayItem>
	)
}
