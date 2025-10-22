import Link from 'next/link'

export default function Footer() {
	return (
		<footer className=" bg-green-900 text-white py-8 px-4 mt-auto">
			<div className="flex justify-center">
				<div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 ">
					<div className="flex flex-col items-center">
						<h3 className="text-lg font-bold mb-4">
							Landscape Friend
						</h3>
						<p className="text-gray-400">
							Track and Invoice your lawn clients easily.
						</p>
					</div>
					<div className="flex flex-col items-center">
						<h3 className="text-lg font-bold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/lists/client"
									className="hover:text-green-300"
								>
									Client List
								</Link>
							</li>
							<li>
								<Link
									href="/billing/manage/invoices"
									className="hover:text-green-300"
								>
									Billing
								</Link>
							</li>
							<li>
								<Link
									href="/documentation"
									className="hover:text-green-300"
								>
									Documentation
								</Link>
							</li>
						</ul>
					</div>
					<div className=" flex flex-col items-center">
						<h3 className="text-lg font-bold mb-4 ">Support</h3>
						<p className="text-gray-400">
							Have questions or need help?
						</p>
						<a
							href="mailto:support@landscapefriend.com"
							className="text-blue-400 hover:text-blue-300"
						>
							support@landscapefriend.com
						</a>
					</div>
				</div>
			</div>
			<div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 ">
				<p>
					&copy; {new Date().getFullYear()} Landscape Friend. All
					rights reserved.
				</p>
				<div className="flex justify-center space-x-4 mt-2">
					<Link
						href="/privacy-policy"
						className="hover:text-green-300"
					>
						Privacy Policy
					</Link>
					<Link
						href="/terms-of-service"
						className="hover:text-green-300"
					>
						Terms of Service
					</Link>
				</div>
			</div>
		</footer>
	)
}
