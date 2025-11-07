import type React from 'react'

interface ClientNameProps {
	fullName: string
}

const ClientName: React.FC<ClientNameProps> = ({ fullName }) => {
	return <p className="w-full text-center">Name: {fullName}</p>
}

export default ClientName
