import Link from 'next/link'
import { Button } from '../button'

export default function Footer() {
	return (
		<footer className="mt-auto bg-green-900 px-4 py-8 text-white">
			<div className="flex justify-center">
				<div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-3">
					<div className="flex flex-col items-center">
						<h3 className="mb-4 font-bold text-lg">
							Landscape Friend
						</h3>
						<p className="text-gray-400">
							Track and Invoice your lawn clients easily.
						</p>
					</div>
					<div className="flex flex-col items-center">
						<h3 className="mb-4 font-bold text-lg">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link
									className="hover:text-green-300"
									href="/lists/client"
								>
									Client List
								</Link>
							</li>
							<li>
								<Link
									className="hover:text-green-300"
									href="/billing/manage/invoices"
								>
									Billing
								</Link>
							</li>
							<li>
								<Link
									className="hover:text-green-300"
									href="/documentation"
								>
									Information
								</Link>
							</li>
						</ul>
					</div>
					<div className="flex flex-col items-center">
						<h3 className="mb-4 font-bold text-lg">Support</h3>
						<p className="text-gray-400">
							Have questions or need help?
						</p>
						<Link
							className="text-blue-400 hover:text-blue-300"
							href="mailto:support@landscapefriend.com"
						>
							support@landscapefriend.com
						</Link>
						<Link href={'/contact'}>
							<Button size={'sm'}variant={'outline'}>
								Send us a message today!
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<div className="mt-8 border-gray-700 border-t pt-4 text-center text-gray-500">
				<p>&copy; 2025 Landscape Friend. All rights reserved.</p>
				<div className="mt-2 flex justify-center space-x-4">
					<Link
						className="hover:text-green-300"
						href="/privacy-policy"
					>
						Privacy Policy
					</Link>
					<Link
						className="hover:text-green-300"
						href="/terms-of-service"
					>
						Terms of Service
					</Link>
				</div>
			</div>
		</footer>
	)
}
