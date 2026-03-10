import FormContainer from '../containers/form-container'
import Spinner from '../loaders/spinner'

export default function ListsClearingClientCardsFallback() {
	return (
		<FormContainer>
			<div className="bg-white/50 p-8 text-center">
				Loading <Spinner />
			</div>
		</FormContainer>
	)
}
