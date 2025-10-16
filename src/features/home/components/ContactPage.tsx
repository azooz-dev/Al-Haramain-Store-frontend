import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HeadphonesIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useApp } from '@/shared/contexts/AppContext';
import { useNavigation } from '@/shared/hooks/useNavigation';

export const ContactPage: React.FC = () => {
  const { isRTL } = useApp();
  const { t: homeT } = useFeatureTranslations("home");
  const { navigateToProducts, navigateToHome, navigateToAboutPage } = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

    const contactInfo = [
    {
      icon: Mail,
      title: isRTL ? 'البريد الإلكتروني' : 'Email Us',
      details: 'info@alharamain.com',
      description: isRTL ? 'نرد خلال 24 ساعة' : 'We reply within 24 hours',
      action: 'mailto:info@alharamain.com',
    },
    {
      icon: Phone,
      title: isRTL ? 'اتصل بنا' : 'Call Us',
      details: '+1 (555) 123-4567',
      description: isRTL ? 'متاح 24/7' : 'Available 24/7',
      action: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: isRTL ? 'زورنا' : 'Visit Us',
      details: '123 Islamic Street, Holy City',
      description: isRTL ? 'السبت - الخميس: 9ص - 6م' : 'Sat-Thu: 9AM - 6PM',
      action: 'https://maps.google.com',
    },
    {
      icon: MessageCircle,
      title: isRTL ? 'الدردشة المباشرة' : 'Live Chat',
      details: isRTL ? 'دردشة فورية' : 'Instant messaging',
      description: isRTL ? 'متاح من 9ص - 6م' : 'Available 9AM - 6PM',
      action: '#',
    },
  ];

  const faqs = [
    {
      question: isRTL ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods do you accept?',
      answer: isRTL 
        ? 'نقبل جميع بطاقات الائتمان الرئيسية، باي بال، والتحويل البنكي. جميع المدفوعات آمنة ومشفرة.'
        : 'We accept all major credit cards, PayPal, and bank transfers. All payments are secure and encrypted.',
    },
    {
      question: isRTL ? 'كم تستغرق عملية الشحن؟' : 'How long does shipping take?',
      answer: isRTL
        ? 'الشحن المحلي 2-3 أيام، والشحن الدولي 7-14 يوم عمل. نوفر أيضاً خدمة الشحن السريع.'
        : 'Domestic shipping takes 2-3 days, international shipping takes 7-14 business days. Express shipping is also available.',
    },
    {
      question: isRTL ? 'هل يمكنني إرجاع المنتجات؟' : 'Can I return products?',
      answer: isRTL
        ? 'نعم، نوفر سياسة إرجاع مجانية خلال 30 يوماً من تاريخ الشراء للمنتجات غير المستخدمة.'
        : 'Yes, we offer a 30-day free return policy for unused products from the date of purchase.',
    },
    {
      question: isRTL ? 'هل منتجاتكم أصلية؟' : 'Are your products authentic?',
      answer: isRTL
        ? 'جميع منتجاتنا أصلية 100% ومعتمدة. نوفر شهادات الأصالة مع جميع المنتجات الثمينة.'
        : 'All our products are 100% authentic and certified. We provide certificates of authenticity with all valuable items.',
    },
    {
      question: isRTL ? 'هل تشحنون دولياً؟' : 'Do you ship internationally?',
      answer: isRTL
        ? 'نعم، نشحن إلى أكثر من 50 دولة حول العالم. تكلفة الشحن تُحسب عند الدفع.'
        : 'Yes, we ship to over 50 countries worldwide. Shipping costs are calculated at checkout.',
    },
  ];

    const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', type: '' });
    }, 2000);
  };

  
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-md text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl mb-4">{homeT("contact.successTitle")}!</h1>
              <p className="text-muted-foreground mb-6">
                {homeT("contact.successDescription")}
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full"
                >
                  {homeT("contact.sendAnotherMessage")}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigateToHome()}
                  className="w-full"
                >
                  {homeT("contact.backToHome")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15z'/%3E%3Cpath d='M30 30l-15-15v30l15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {homeT("contact.title")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {homeT("contact.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="group text-center bg-card/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg mb-2">{info.title}</h3>
                  <p className="text-sm text-foreground mb-1">{info.details}</p>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-amber-600 ml-2" />
                    <span>{isRTL ? "أرسل لنا رسالة" : "Send us a Message"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{homeT("contact.name")}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{homeT("contact.email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="type">{homeT("contact.inquiryType")}</Label>
                      <Select onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger className="mt-2 bg-gray-100 dark:bg-[#121212]">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">{homeT("contact.generalInquiry")}</SelectItem>
                          <SelectItem value="product">{homeT("contact.productQuestion")}</SelectItem>
                          <SelectItem value="order">{homeT("contact.orderSupport")}</SelectItem>
                          <SelectItem value="wholesale">{homeT("contact.wholesale")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">{homeT("contact.subject")}</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">{homeT("contact.message")}</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                        rows={6}
                        className="mt-2 bg-gray-100 dark:bg-[#121212] text-foreground"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{homeT("contact.sending")}...</span>
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                            {homeT("contact.sendMessage")}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="space-y-6">
              {/* Business Hours */}
              <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-amber-600 ml-2" />
                    <span>{homeT("contact.businessHours")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>{homeT("contact.saturdayThursday")}</span>
                    <span>{homeT("contact.saturdayThursdayHours")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{homeT("contact.friday")}</span>
                    <span>{homeT("contact.fridayHours")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{homeT("contact.customerSupport")}</span>
                    <span>{homeT("contact.customerSupportHours")}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Support Channels */}
              <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HeadphonesIcon className="h-5 w-5 text-amber-600 ml-2" />
                    <span>{homeT("contact.supportChannels")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center ml-2">
                      <Mail className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm">{homeT("contact.emailSupport")}</p>
                      <p className="text-xs text-muted-foreground">{homeT("contact.emailSupportDescription")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center ml-2">
                      <Phone className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm">{homeT("contact.phoneSupport")}</p>
                      <p className="text-xs text-muted-foreground">{homeT("contact.phoneSupportDescription")}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center ml-2">
                      <MessageCircle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm">{homeT("contact.liveChat")}</p>
                      <p className="text-xs text-muted-foreground">{homeT("contact.liveChatDescription")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>{homeT("contact.quickActions")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigateToProducts()}
                  >
                    {homeT("contact.browseProducts")}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigateToAboutPage()}
                  >
                    {homeT("contact.learnAboutUs")}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    {homeT("contact.trackYourOrder")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">{homeT("contact.frequentlyAskedQuestions")}</h2>
            <p className="text-muted-foreground text-lg">
              {homeT("contact.frequentlyAskedQuestionsDescription")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card/50 backdrop-blur-sm border-0 shadow-lg rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}