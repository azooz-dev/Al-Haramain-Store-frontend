import React from 'react';
import { Award, Heart, Shield, Globe } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useApp } from '@/shared/contexts/AppContext';
import { useFeatureTranslations } from '@/shared/hooks/useTranslation';
import { useNavigation } from '@/shared/hooks/useNavigation';

export const AboutPage: React.FC = () => {
  const { isRTL } = useApp();
  const { t: homeT } = useFeatureTranslations("home");
  const { navigateToProducts, navigateToContactPage } = useNavigation();

    const values = [
    {
      icon: Heart,
      title: isRTL ? 'الصدق والأمانة' : 'Integrity & Trust',
      description: isRTL 
        ? 'نلتزم بأعلى معايير الصدق والأمانة في جميع تعاملاتنا'
        : 'We maintain the highest standards of honesty and trustworthiness in all our dealings',
    },
    {
      icon: Award,
      title: isRTL ? 'الجودة العالية' : 'Premium Quality',
      description: isRTL
        ? 'نوفر منتجات عالية الجودة مصنوعة بعناية ومهارة'
        : 'We provide high-quality products crafted with care and expertise',
    },
    {
      icon: Shield,
      title: isRTL ? 'الأصالة' : 'Authenticity',
      description: isRTL
        ? 'جميع منتجاتنا أصلية ومعتمدة وفقاً للتقاليد الإسلامية'
        : 'All our products are authentic and certified according to Islamic traditions',
    },
    {
      icon: Globe,
      title: isRTL ? 'خدمة عالمية' : 'Global Service',
      description: isRTL
        ? 'نخدم العملاء في جميع أنحاء العالم بكل احترافية'
        : 'We serve customers worldwide with complete professionalism',
    },
  ];

    const timeline = [
    {
      year: '2010',
      title: isRTL ? 'البداية' : 'Foundation',
      description: isRTL 
        ? 'تأسست الشركة برؤية لتوفير منتجات إسلامية أصيلة'
        : 'Company founded with a vision to provide authentic Islamic products',
    },
    {
      year: '2015',
      title: isRTL ? 'التوسع' : 'Expansion',
      description: isRTL
        ? 'توسعنا لخدمة 20 دولة حول العالم'
        : 'Expanded to serve 20 countries worldwide',
    },
    {
      year: '2020',
      title: isRTL ? 'التطوير التقني' : 'Digital Transformation',
      description: isRTL
        ? 'إطلاق المتجر الإلكتروني وتطبيق الهاتف المحمول'
        : 'Launched e-commerce platform and mobile application',
    },
    {
      year: '2025',
      title: isRTL ? 'الحاضر' : 'Present',
      description: isRTL
        ? 'نخدم أكثر من 10,000 عميل في 50 دولة'
        : 'Serving over 10,000 customers in 50 countries',
    },
  ];

    const stats = [
    { number: '15+', label: isRTL ? 'سنوات من الخبرة' : 'Years of Experience' },
    { number: '10K+', label: isRTL ? 'عميل راضٍ' : 'Happy Customers' },
    { number: '50+', label: isRTL ? 'دولة نخدمها' : 'Countries Served' },
    { number: '1000+', label: isRTL ? 'منتج متوفر' : 'Products Available' },
  ];

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
              {homeT("about.title")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {homeT("about.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-card/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="text-3xl md:text-4xl text-amber-600 mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">{homeT("about.valuesTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {homeT("about.valuesDescription")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="group text-center bg-card/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">{homeT("about.journeyTitle")}</h2>
            <p className="text-muted-foreground text-lg">
              {homeT("about.journeyDescription")}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-amber-600 text-white">{item.year}</Badge>
                        <h3 className="text-lg mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-600 rounded-full border-4 border-background shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">{homeT("about.joinJourneyTitle")}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {homeT("about.joinJourneyDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigateToProducts()}
              className="bg-white text-amber-600 px-8 py-3 rounded-full hover:bg-amber-50 transition-colors"
            >
              {homeT("about.shopProductsButton")}
            </button>
            <button 
              onClick={() => navigateToContactPage()}
              className="border border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              {homeT("about.contactButton")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}