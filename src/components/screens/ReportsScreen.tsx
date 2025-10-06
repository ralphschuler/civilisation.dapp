import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { ScrollArea } from '../ui/ScrollArea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Alert, AlertDescription } from '../ui/Alert';
import { 
  ArrowLeft,
  Trash2, 
  Eye, 
  Archive, 
  Users, 
  Swords, 
  Package,
  Building,
  Calendar,
  Settings,
  TrendingUp,
  TrendingDown,
  Trophy,
  Skull,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { useI18n } from '@/providers/i18n-provider';
import { BattleReportDetail } from '../game/BattleReportDetail';
import { Report, ReportType } from '../../types/reports';
import { mockReports } from '../../data/mockReports';
import { useReportStore } from '@/stores';

interface ReportsScreenProps {
  reports?: Report[]; // optional legacy prop; store data is preferred
}

export function ReportsScreen({ reports: propReports = mockReports }: ReportsScreenProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Repository-backed store
  const {
    reports: storeReports,
    unreadCount: storeUnread,
    loadReports,
    markAsRead,
    deleteReport,
  } = useReportStore();

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Prefer store data; fall back to prop/mock
  const reports = useMemo(() => (storeReports.length ? storeReports : propReports), [storeReports, propReports]);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${t('screens.reports.time.ago', 'vor')} ${days} ${t(days > 1 ? 'screens.reports.time.days' : 'screens.reports.time.day', days > 1 ? 'Tagen' : 'Tag')}`;
    if (hours > 0) return `${t('screens.reports.time.ago', 'vor')} ${hours} ${t(hours > 1 ? 'screens.reports.time.hours' : 'screens.reports.time.hour', hours > 1 ? 'Stunden' : 'Stunde')}`;
    if (minutes > 0) return `${t('screens.reports.time.ago', 'vor')} ${minutes} ${t(minutes > 1 ? 'screens.reports.time.minutes' : 'screens.reports.time.minute', minutes > 1 ? 'Minuten' : 'Minute')}`;
    return t('screens.reports.time.justNow', 'gerade eben');
  };

  const getReportIcon = (type: ReportType) => {
    const icons = {
      battle: <Swords className="h-4 w-4" />,
      trade: <Package className="h-4 w-4" />,
      spy: <Eye className="h-4 w-4" />,
      building: <Building className="h-4 w-4" />,
      event: <Calendar className="h-4 w-4" />,
      system: <Settings className="h-4 w-4" />
    };
    return icons[type];
  };

  const getReportColor = (type: ReportType) => {
    const colors = {
      battle: 'destructive',
      trade: 'default',
      spy: 'secondary',
      building: 'default',
      event: 'outline',
      system: 'secondary'
    } as const;
    return colors[type];
  };

  const getReportTypeLabel = (type: ReportType) => {
    const labels = {
      battle: t('screens.reports.types.battle', 'Kampf'),
      trade: t('screens.reports.types.trade', 'Handel'),
      spy: t('screens.reports.types.spy', 'Spionage'),
      building: t('screens.reports.types.building', 'Gebäude'),
      event: t('screens.reports.types.event', 'Ereignis'),
      system: t('screens.reports.types.system', 'System')
    } as const;
    return labels[type];
  };

  const getBattleResultIcon = (result?: string) => {
    switch (result) {
      case 'victory': return <Trophy className="h-4 w-4 text-success" />;
      case 'defeat': return <Skull className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const filteredReports = reports.filter(report => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !report.read;
    if (activeTab === 'important') return report.important;
    if (activeTab === 'battle') return report.type === 'battle';
    if (activeTab === 'archived') return report.archived;
    return report.type === activeTab;
  });

  const unreadCount = storeReports.length ? storeUnread : reports.filter(r => !r.read).length;
  const importantCount = reports.filter(r => r.important).length;
  const battleCount = reports.filter(r => r.type === 'battle').length;

  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleReportClick = (report: Report, event: React.MouseEvent) => {
    // Prevent selection when clicking chevron for details
    if ((event.target as HTMLElement).closest('.detail-trigger')) {
      setSelectedReport(report);
      setShowDetailDialog(true);
      return;
    }
    
    // Toggle selection
    toggleReportSelection(report.id);
  };

  const handleMarkAsRead = async () => {
    await Promise.all(selectedReports.map(id => markAsRead(id)));
    setSelectedReports([]);
  };

  const handleArchive = () => {
    // Archive selected reports
    setSelectedReports([]);
  };

  const handleDelete = async () => {
    await Promise.all(selectedReports.map(id => deleteReport(id)));
    setSelectedReports([]);
  };

  const renderReportContent = (report: Report) => {
    return (
      <Card 
        key={report.id} 
        className={`cursor-pointer transition-all duration-200 hover:shadow-md min-touch ${
          !report.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
        } ${
          selectedReports.includes(report.id) ? 'bg-accent/20 border-accent' : ''
        } ${
          report.important ? 'shadow-sm' : ''
        }`}
        onClick={(e) => handleReportClick(report, e)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-start gap-2">
                {getReportIcon(report.type)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-section leading-none ${!report.read ? 'font-medium' : ''}`}>
                      {report.title}
                    </h4>
                    {report.battleData && getBattleResultIcon(report.battleData.result)}
                    {report.important && (
                      <Badge variant="destructive" className="text-micro px-2 py-0.5">
                        {t('screens.reports.badges.important', 'Wichtig')}
                      </Badge>
                    )}
                  </div>
                  
                  <p className={`text-caption leading-relaxed ${
                    !report.read ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {report.summary}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <Badge variant={getReportColor(report.type)} className="text-micro px-2 py-0.5">
                      {getReportTypeLabel(report.type)}
                    </Badge>
                    <span className="text-micro text-muted-foreground">
                      {formatTime(report.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail button for detailed reports */}
            {(report.battleData || report.spyData) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="detail-trigger flex-shrink-0 min-touch p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedReport(report);
                  setShowDetailDialog(true);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="min-touch"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-title-sm">📜</span>
          <h1 className="text-title-sm font-medium">{t('screens.reports.title', 'Reports')}</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-micro">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        {selectedReports.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleMarkAsRead} className="min-touch">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleArchive} className="min-touch">
              <Archive className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleDelete} className="min-touch">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {unreadCount > 0 && (
        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertDescription>
            {t('screens.reports.unreadSummary.prefix', 'Du hast')} {unreadCount} {t('screens.reports.unreadSummary.unread', 'ungelesene Berichte')}
            {importantCount > 0 && <>
              {`, ${t('screens.reports.unreadSummary.ofWhich', 'davon')} ${importantCount} ${t('screens.reports.unreadSummary.important', 'wichtige')}`}
            </>}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs and Content */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-4 pb-0">
              <TabsList className="grid grid-cols-4 w-full mb-4">
                <TabsTrigger value="all" className="text-caption">
                  {t('screens.reports.all', 'All')} ({reports.length})
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-caption">
                  {t('screens.reports.unread', 'New')} ({unreadCount})
                </TabsTrigger>
                <TabsTrigger value="battle" className="text-caption">
                  {t('screens.reports.battle', 'Battles')} ({battleCount})
                </TabsTrigger>
                <TabsTrigger value="important" className="text-caption">
                  {t('screens.reports.important', 'Important')} ({importantCount})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="m-0">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-3 p-4">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => renderReportContent(report))
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-3">📭</div>
                      <h3 className="text-section font-medium mb-2">{t('screens.reports.empty.title', 'Keine Berichte')}</h3>
                      <p className="text-caption text-muted-foreground">
                        {activeTab === 'unread' 
                          ? t('screens.reports.empty.allRead', 'Alle Berichte wurden bereits gelesen.')
                          : t('screens.reports.empty.noneInCategory', 'Keine Berichte in dieser Kategorie vorhanden.')}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedReport && getReportIcon(selectedReport.type)}
              {selectedReport?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedReport?.battleData && (
            <BattleReportDetail 
              battleData={selectedReport.battleData}
              onClose={() => setShowDetailDialog(false)}
            />
          )}
          
          {selectedReport?.spyData && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    {t('screens.reports.spy.title', 'Spionage-Bericht')}: {selectedReport.spyData.target}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedReport.spyData.discovered && (
                    <Alert>
                      <TrendingDown className="h-4 w-4" />
                      <AlertDescription>
                        {t('screens.reports.spy.discovered', 'Deine Spione wurden entdeckt!')}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {selectedReport.spyData.resources && (
                    <div>
                      <h4 className="font-medium mb-2">{t('screens.reports.spy.resources', 'Ressourcen')}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedReport.spyData.resources).map(([resource, amount]) => (
                          <div key={resource} className="flex justify-between p-2 bg-muted/30 rounded-md">
                            <span className="text-caption">{resource}</span>
                            <span className="text-caption font-medium">{amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReport.spyData.units && (
                    <div>
                      <h4 className="font-medium mb-2">{t('screens.reports.spy.units', 'Einheiten')}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedReport.spyData.units).map(([unit, count]) => (
                          <div key={unit} className="flex justify-between p-2 bg-muted/30 rounded-md">
                            <span className="text-caption">{unit}</span>
                            <span className="text-caption font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReport.spyData.buildings && (
                    <div>
                      <h4 className="font-medium mb-2">{t('screens.reports.spy.buildings', 'Gebäude')}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedReport.spyData.buildings).map(([building, level]) => (
                          <div key={building} className="flex justify-between p-2 bg-muted/30 rounded-md">
                            <span className="text-caption">{building}</span>
                            <span className="text-caption font-medium">{t('screens.reports.spy.level', 'Stufe')} {level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button onClick={() => setShowDetailDialog(false)} className="w-full">
                    {t('common.close', 'Schließen')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other report types show basic summary */}
          {!selectedReport?.battleData && !selectedReport?.spyData && selectedReport && (
            <div className="space-y-4">
              <div className="text-caption">
                {selectedReport.summary}
              </div>
              <Button onClick={() => setShowDetailDialog(false)} className="w-full">
                {t('common.close', 'Schließen')}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
