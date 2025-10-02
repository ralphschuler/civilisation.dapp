import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  FileText, 
  Youtube, 
  ExternalLink,
  Search,
  Book,
  Users,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HelpSupportScreenProps {
  onBack?: () => void;
}

const faqData = [
  {
    id: 'resources',
    question: 'Wie sammle ich Ressourcen?',
    answer: 'Ressourcen werden automatisch von deinen Gebäuden produziert. Tippe auf das Sammeln-Symbol neben jeder Ressource, um sie zu sammeln. Du kannst auch die Produktionsgebäude upgraden, um mehr Ressourcen pro Stunde zu erhalten.'
  },
  {
    id: 'buildings',
    question: 'Wie upgrade ich Gebäude?',
    answer: 'Tippe auf ein Gebäude in deiner Stadt und dann auf "Upgrade". Du brauchst genügend Ressourcen und einen freien Bauslot. Höhere Townhall-Level schalten mehr Bauslots frei.'
  },
  {
    id: 'army',
    question: 'Wie trainiere ich Einheiten?',
    answer: 'Gehe zum Armee-Tab und wähle die Einheit aus, die du trainieren möchtest. Jede Einheit kostet bestimmte Ressourcen und Bevölkerung. Stelle sicher, dass du genug Houses für die Bevölkerung hast.'
  },
  {
    id: 'combat',
    question: 'Wie funktioniert das Kampfsystem?',
    answer: 'Jede Einheit hat Stärken und Schwächen. Kavallerie ist stark gegen Fernkämpfer, aber schwach gegen Speerkämpfer. Schwertkämpfer sind gut gegen Axtkämpfer. Nutze verschiedene Einheitentypen für eine ausgewogene Armee.'
  },
  {
    id: 'defense',
    question: 'Wie verteidige ich meine Stadt?',
    answer: 'Baue Mauern, um deine Stadt zu schützen. Höhere Mauerstufen bieten besseren Schutz. Stelle Verteidigungseinheiten in deiner Stadt ab und achte auf die Berichte über feindliche Angriffe.'
  },
  {
    id: 'world',
    question: 'Wie erkunde ich die Welt?',
    answer: 'Nutze die Weltkarte, um andere Spieler, neutrale Camps und Ressourcenfelder zu finden. Du kannst Späher schicken, um Informationen zu sammeln, oder Armeen für Angriffe entsenden.'
  }
];

const tutorialSections = [
  {
    id: 'getting-started',
    title: 'Erste Schritte',
    description: 'Grundlagen des Spiels verstehen',
    icon: Book,
    lessons: [
      'Deine erste Stadt',
      'Ressourcen verstehen',
      'Gebäude bauen',
      'Erste Einheiten trainieren'
    ]
  },
  {
    id: 'advanced',
    title: 'Fortgeschritten',
    description: 'Strategien und Taktiken',
    icon: Users,
    lessons: [
      'Armeen zusammenstellen',
      'Angriffs- und Verteidigungsstrategien',
      'Ressourcen-Management',
      'Diplomatie und Allianzen'
    ]
  }
];

export function HelpSupportScreen({ onBack }: HelpSupportScreenProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('faq');
  const [supportMessage, setSupportMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const filteredFaq = faqData.filter(
    item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendSupport = () => {
    // TODO: Implement support ticket submission
    console.log('Support message:', { email: contactEmail, message: supportMessage });
    setSupportMessage('');
    setContactEmail('');
    // Show success toast
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/more')}
              className="mr-2 h-auto p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <HelpCircle className="h-5 w-5" />
            Hilfe & Support
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-section">Schnelle Hilfe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-auto p-3 flex-col gap-2"
              onClick={() => setSelectedCategory('tutorial')}
            >
              <Youtube className="h-5 w-5" />
              <span className="text-caption">Video-Tutorial</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-3 flex-col gap-2"
              onClick={() => setSelectedCategory('faq')}
            >
              <FileText className="h-5 w-5" />
              <span className="text-caption">FAQ</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-3 flex-col gap-2"
              onClick={() => setSelectedCategory('contact')}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-caption">Support</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-3 flex-col gap-2"
              onClick={() => window.open('https://discord.gg/example', '_blank')}
            >
              <Users className="h-5 w-5" />
              <span className="text-caption">Community</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      {selectedCategory === 'faq' && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="FAQ durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content based on selected category */}
      {selectedCategory === 'faq' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-section">Häufig gestellte Fragen</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaq.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {selectedCategory === 'tutorial' && (
        <div className="space-y-4">
          {tutorialSections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-section">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </CardTitle>
                <p className="text-caption text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.lessons.map((lesson, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-between h-auto p-3"
                    onClick={() => {
                      // TODO: Navigate to tutorial lesson
                      console.log('Open tutorial lesson:', lesson);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-caption font-medium">{index + 1}</span>
                      </div>
                      <span className="text-body">{lesson}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedCategory === 'contact' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-section">Support kontaktieren</CardTitle>
            <p className="text-caption text-muted-foreground">
              Beschreibe dein Problem so detailliert wie möglich. Wir antworten normalerweise innerhalb von 24 Stunden.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">E-Mail-Adresse</label>
              <Input
                type="email"
                placeholder="deine@email.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Nachricht</label>
              <Textarea
                placeholder="Beschreibe dein Problem oder deine Frage..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                <div className="text-caption text-muted-foreground">
                  <strong>Tipp:</strong> Füge Screenshots oder Spieler-ID hinzu, um eine schnellere Bearbeitung zu ermöglichen.
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleSendSupport}
              disabled={!contactEmail || !supportMessage}
            >
              <Mail className="h-4 w-4 mr-2" />
              Nachricht senden
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contacts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-section">Weitere Hilfe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <ExternalLink className="h-4 w-4 mr-2" />
            Spielregeln & Richtlinien
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <ExternalLink className="h-4 w-4 mr-2" />
            Technische Probleme melden
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <ExternalLink className="h-4 w-4 mr-2" />
            Feedback & Verbesserungsvorschläge
          </Button>
          
          <Separator />
          
          <div className="text-caption text-muted-foreground text-center">
            <div className="font-medium">Support-Zeiten</div>
            <div>Mo-Fr: 9:00 - 18:00 CET</div>
            <div>Sa-So: 10:00 - 16:00 CET</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}