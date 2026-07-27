import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, MessageSquare, Mail, FileText, Bug, Lightbulb, Send } from 'lucide-react';

const faqs = [
  { q: 'How do I add funds to my wallet?', a: 'Navigate to the Wallet page and click the "Deposit" button. You can add funds using UPI, debit card, credit card, net banking, or wallet transfer.' },
  { q: 'How do I place a trade?', a: 'Go to the Trade page, search for a stock, enter the quantity and price, and click Buy or Sell. You can choose between delivery and intraday products.' },
  { q: 'What is the AI Investment Intelligence Suite?', a: 'Our AI suite provides portfolio analysis, risk assessment, market sentiment, personalized recommendations, and a chat assistant to help you make informed decisions.' },
  { q: 'How do I enable two-factor authentication?', a: 'Go to Settings > Security and toggle on Two-Factor Authentication. You will need to verify your phone number and enter a code sent to you.' },
  { q: 'How do I withdraw funds from my wallet?', a: 'Navigate to the Wallet page and click "Withdraw". Enter the amount and select your bank account. Withdrawals typically take 1-2 business days.' },
  { q: 'Can I change my risk profile?', a: 'Yes, go to Settings > Account and update your risk profile. This will adjust AI recommendations accordingly.' },
  { q: 'How are my portfolio returns calculated?', a: 'Portfolio returns are calculated using the time-weighted return method, accounting for deposits, withdrawals, and dividends.' },
  { q: 'Is my data secure?', a: 'We use bank-grade encryption for all data. Your personal information is never shared with third parties without your consent.' },
];

const helpCards = [
  { icon: MessageSquare, title: 'Live Chat', description: 'Chat with our support team in real-time', action: 'Start Chat' },
  { icon: Mail, title: 'Contact Support', description: 'Send us an email and we will respond within 24 hours', action: 'Send Email' },
  { icon: FileText, title: 'Documentation', description: 'Browse our comprehensive documentation', action: 'View Docs' },
];

export function HelpCenter() {
  return (
    <div className="space-y-6">
      {/* Quick Help Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {helpCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -2 }}
          >
            <Card className="flex h-full flex-col p-4 transition-shadow hover:shadow-card-hover">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <card.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-semibold">{card.title}</p>
              <p className="mt-0.5 flex-1 text-xs text-muted-foreground">{card.description}</p>
              <Button variant="outline" size="sm" className="mt-3 self-start text-xs">{card.action}</Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <Card className="p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
          <HelpCircle className="h-4 w-4 text-primary" />
          Frequently Asked Questions
        </h3>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-lg border border-border px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Feedback & Bug Report */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
            <Lightbulb className="h-4 w-4 text-primary" />
            Feedback
          </h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Subject</Label>
              <Input placeholder="What is your feedback about?" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Message</Label>
              <Textarea placeholder="Share your thoughts, ideas, or suggestions..." className="min-h-[100px]" />
            </div>
            <Button className="w-full gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Submit Feedback
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
            <Bug className="h-4 w-4 text-danger" />
            Bug Report
          </h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Bug Category</Label>
              <Select defaultValue="ui">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ui">UI / Visual</SelectItem>
                  <SelectItem value="functionality">Functionality</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea placeholder="Describe the bug in detail..." className="min-h-[100px]" />
            </div>
            <Button variant="destructive" className="w-full gap-1.5">
              <Send className="h-3.5 w-3.5" />
              Submit Bug Report
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
