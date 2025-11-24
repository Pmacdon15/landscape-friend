'use client'

import FormContainer from '@/components/ui/containers/form-container'
import FormHeader from '@/components/ui/header/form-header'
import ManyPointsMap from '@/components/ui/map-component/many-points-map'

export default function TestMapPage() {
	// Mock addresses for testing
	const addresses = [
		'1600 Amphitheatre Parkway, Mountain View, CA',
		'1 Infinite Loop, Cupertino, CA',
		'1 Hacker Way, Menlo Park, CA',
		'350 Fifth Avenue, New York, NY',
		'400 Broad St, Seattle, WA',
		'500 Terry A Francois Blvd, San Francisco, CA',
		'600 Congress Ave, Austin, TX',
		'700 Pennsylvania Ave, Washington, DC',
		'800 Boylston St, Boston, MA',
		'900 N Michigan Ave, Chicago, IL',
		'1000 Van Ness Ave, San Francisco, CA',
		'1100 15th St, Denver, CO',
		'1200 Peachtree St, Atlanta, GA',
	]

	return (
		<FormContainer>
			<FormHeader text="Map Component Test Page" />
			<div className="p-4">
				<p className="mb-4">
					This page tests the ManyPointsMap component with{' '}
					{addresses.length} addresses. It should work even if your
					location cannot be determined (simulating laptop
					environment).
				</p>
				<p className="mb-4 text-gray-600 text-sm">
					<strong>Instructions:</strong>
					<br />
					1. Check if the map loads below.
					<br />
					2. Open browser console (F12) to see "Generated Route
					Chunks" logs.
					<br />
					3. Click the route buttons to verify they open Google Maps
					correctly.
					<br />
					4. Verify "Uthrive" does not appear as the origin if you are
					not there.
				</p>

				<ManyPointsMap addresses={addresses} />
			</div>
		</FormContainer>
	)
}
