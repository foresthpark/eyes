import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-20">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-light mb-6">Get in Touch</h1>
        <p className="text-gray-500 text-lg">
          Whether you're interested in a print, a collaboration, or just want to say hello, I'd love to hear from you.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white border border-gray-100 p-8 md:p-12 shadow-sm">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-widest font-semibold">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              className="rounded-none border-0 border-b border-gray-200 focus-visible:ring-0 focus-visible:border-black transition-colors px-0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-widest font-semibold">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="rounded-none border-0 border-b border-gray-200 focus-visible:ring-0 focus-visible:border-black transition-colors px-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-xs uppercase tracking-widest font-semibold">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Tell me about your project..."
              className="min-h-[150px] rounded-none border-0 border-b border-gray-200 focus-visible:ring-0 focus-visible:border-black transition-colors px-0 resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-none bg-black text-white hover:bg-gray-900 h-14 uppercase tracking-widest text-sm font-medium transition-all"
          >
            Send Message
          </Button>
        </form>
      </div>

      <div className="mt-20 text-center text-sm text-gray-400 uppercase tracking-[0.2em]">
        <p>Oregon, United States</p>
        <p className="mt-2">hello@eyesofforest.com</p>
      </div>
    </div>
  )
}
