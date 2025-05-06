
import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="text-vending-blue hover:text-white hover:bg-vending-blue"
          >
            Submit another request
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-6">Request a Demo</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="fullName" className="mb-1">Full Name *</Label>
          <Input
            type="text"
            id="fullName"
            className="w-full"
            placeholder="John Doe"
            required
            value={formState.fullName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="businessEmail" className="mb-1">Business Email *</Label>
          <Input
            type="email"
            id="businessEmail"
            className="w-full"
            placeholder="john@company.com"
            required
            value={formState.businessEmail}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="company" className="mb-1">Company Name</Label>
          <Input
            type="text"
            id="company"
            className="w-full"
            placeholder="Acme Inc."
            value={formState.company}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="phone" className="mb-1">Phone Number</Label>
          <Input
            type="tel"
            id="phone"
            className="w-full"
            placeholder="(555) 555-5555"
            value={formState.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="message" className="mb-1">Message</Label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
            placeholder="Tell us about your needs and any questions you have."
            value={formState.message}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <Button
          type="submit"
          className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Request Demo'}
        </Button>
      </form>
    </div>
  )
}
