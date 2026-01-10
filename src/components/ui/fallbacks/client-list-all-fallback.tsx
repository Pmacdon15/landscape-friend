import FormContainer from '../containers/form-container'
import FormHeader from '../header/form-header'

export default function ClientListAllFallback() {
	return (
		<FormContainer>
			<FormHeader text="Loading . . ." />
		</FormContainer>
	)
}
