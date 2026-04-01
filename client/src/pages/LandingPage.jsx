import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import AIInsights from '../components/AIInsights'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div>
      <Hero/>
      <Features/>
      <HowItWorks/>
      <AIInsights/>
      <CTA/>
      <Footer/>
    </div>
  )
}

export default LandingPage
