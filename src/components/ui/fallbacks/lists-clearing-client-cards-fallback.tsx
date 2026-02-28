import FormContainer from '../containers/form-container'
import Spinner from '../loaders/spinner'

export default function ListsClearingClientCardsFallback() {
	return (
		<FormContainer>
			<div className="text-center bg-white/50 p-8">
				Loading <Spinner />
			</div>
		</FormContainer>
	)
}
