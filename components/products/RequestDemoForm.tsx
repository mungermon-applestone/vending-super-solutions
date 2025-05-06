
import React, { useState } from 'react'
import { Check } from 'lucide-react'

export default function RequestDemoForm() {
  const [formState, setFormState] = useState({
    fullName: '',
    businessEmail: '',
    company: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormState(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      console.log('Form submitted:', formState)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Your demo request has been received. One of our representatives will contact you shortly.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Submit another request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-6">Request a Demo</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            id="fullName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
            required
            value={formState.fullName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-1">Business Email *</label>
          <input
            type="email"
            id="businessEmail"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="john@company.com"
            required
            value={formState.businessEmail}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            id="company"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Acme Inc."
            value={formState.company}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            id="phone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="(555) 555-5555"
            value={formState.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us about your needs and any questions you have."
            value={formState.message}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Request Demo'}
        </button>
      </form>
    </div>
  )
}
