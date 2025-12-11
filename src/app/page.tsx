'use client'
import '@/animations/landing-page.css'
import HeroComponent from '@/components/ui/hero/hero-component'
import PlansContent from '@/components/ui/home/plans-content'
import WelcomeMessage from '@/components/ui/home/welcome-message'
import WhyChooseUsMessage from '@/components/ui/home/why-choose-us-message'


export default function Home() {
	return (
		<>
			<HeroComponent />

			<WelcomeMessage />

			<WhyChooseUsMessage />

			<PlansContent />
		</>
	)
}
