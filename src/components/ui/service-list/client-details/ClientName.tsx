import React from 'react'

interface ClientNameProps {
	fullName: string
}

const ClientName: React.FC<ClientNameProps> = ({ fullName }) => {
	return <p className="text-center w-full">Name: {fullName}</p>
}

export default ClientName
