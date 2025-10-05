import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Separator } from '../ui/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Trophy, Target, Zap, Crown, Swords, Shield, TrendingUp, Package, Users, MapPin, Clock, Star, Gift, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/providers/i18n-provider';

interface AchievementsScreenProps {
  onBack: () => void;
}

export function AchievementsScreen({ onBack }: AchievementsScreenProps) {
  const { t } = useI18n();
  // Mock data - würde normalerweise aus gameState kommen
  const achievements = [
    {
      id: 'builder_novice',
      name: 'Baumeister-Novize',
      description: 'Upgrade 10 Gebäude',
      category: 'building',
      progress: 8,
      maxProgress: 10,
      completed: false,
      reward: { type: 'gold', amount: 500 },
      icon: '🏗️',
      rarity: 'common'
    },
    {
      id: 'resource_collector',
      name: 'Ressourcensammler',
      description: 'Sammle 10.000 Ressourcen',
      category: 'resource',
      progress: 10000,
      maxProgress: 10000,
      completed: true,
      reward: { type: 'gold', amount: 300 },
      icon: '📦',
      rarity: 'common'
    },
    {
      id: 'first_victory',
      name: 'Erster Sieg',
      description: 'Gewinne deinen ersten Kampf',
      category: 'combat',
      progress: 1,
      maxProgress: 1,
      completed: true,
      reward: { type: 'title', value: 'Kriegsherr' },
      icon: '⚔️',
      rarity: 'uncommon'
    },
    {
      id: 'province_conqueror',
      name: 'Provinzeroberer',
      description: 'Erobere 3 Provinzen',
      category: 'territory',
      progress: 1,
      maxProgress: 3,
      completed: false,
      reward: { type: 'bonus', value: '+10% Ressourcenproduktion' },
      icon: '🗺️',
      rarity: 'rare'
    },
    {
      id: 'army_commander',
      name: 'Armeekommandant',
      description: 'Trainiere 100 Einheiten',
      category: 'military',
      progress: 67,
      maxProgress: 100,
      completed: false,
      reward: { type: 'unit', value: '5 Elite-Ritter' },
      icon: '🛡️',
      rarity: 'epic'
    },
    {
      id: 'fortress_master',
      name: 'Festungsmeister',
      description: 'Erreiche Wall Level 10',
      category: 'defense',
      progress: 0,
      maxProgress: 1,
      completed: false,
      locked: true,
      requirement: 'Rathaus Level 15 benötigt',
      reward: { type: 'bonus', value: '+25% Verteidigungsbonus' },
      icon: '🏰',
      rarity: 'legendary'
    }
  ];

  const quests = [
    {
      id: 'daily_login',
      name: 'Tägliche Anmeldung',
      description: 'Logge dich 7 Tage hintereinander ein',
      type: 'daily',
      progress: 3,
      maxProgress: 7,
      timeLeft: '18:30:42',
      reward: { type: 'gold', amount: 1000 },
      icon: '📅'
    },
    {
      id: 'weekly_builder',
      name: 'Wöchentlicher Baumeister',
      description: 'Upgrade 5 Gebäude diese Woche',
      type: 'weekly',
      progress: 2,
      maxProgress: 5,
      timeLeft: '4d 12h',
      reward: { type: 'resource', value: '1000 Holz, Lehm, Eisen' },
      icon: '🔨'
    },
    {
      id: 'season_warrior',
      name: 'Saison-Krieger',
      description: 'Gewinne 50 Kämpfe in dieser Saison',
      type: 'seasonal',
      progress: 12,
      maxProgress: 50,
      timeLeft: '23d 8h',
      reward: { type: 'cosmetic', value: 'Goldene Rüstung (Skin)' },
      icon: '🏆'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'uncommon': return 'text-green-600 border-green-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-yellow-600 border-yellow-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const formatReward = (reward: any) => {
    switch (reward.type) {
      case 'gold': return `${reward.amount} ${t('screens.achievements.rewards.goldUnit', 'Gold')}`;
      case 'resource': return reward.value;
      case 'title': return `${t('screens.achievements.rewards.titleLabel', 'Titel')}: ${reward.value}`;
      case 'bonus': return reward.value;
      case 'unit': return reward.value;
      case 'cosmetic': return reward.value;
      default: return t('screens.achievements.rewards.unknown', 'Unbekannte Belohnung');
    }
  };

  const completedAchievements = achievements.filter(a => a.completed).length;
  const totalAchievements = achievements.filter(a => !a.locked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-title-sm">{t('screens.achievements.title', 'Erfolge & Quests')}</h1>
        <Button variant="outline" onClick={onBack} size="sm">
          {t('common.back', 'Zurück')}
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-section font-medium">{t('screens.achievements.progress', 'Fortschritt')}</h3>
                <p className="text-caption text-muted-foreground">
                  {completedAchievements} {t('screens.achievements.of', 'von')} {totalAchievements} {t('screens.achievements.achievements', 'Erfolgen')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-title text-primary font-medium">
                {Math.round((completedAchievements / totalAchievements) * 100)}%
              </div>
              <Progress 
                value={(completedAchievements / totalAchievements) * 100} 
                className="w-20 h-2 mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements" className="text-caption">{t('screens.achievements.tabs.achievements', 'Erfolge')}</TabsTrigger>
          <TabsTrigger value="quests" className="text-caption">{t('screens.achievements.tabs.quests', 'Quests')}</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-3">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`relative ${achievement.locked ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl">
                      {achievement.locked ? <Lock className="w-6 h-6 text-muted-foreground" /> : achievement.icon}
                    </div>
                    {achievement.completed && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-body font-medium">{t(`screens.achievements.items.${achievement.id}.name`, achievement.name)}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-micro ${getRarityColor(achievement.rarity)}`}
                      >
                        {t(`screens.achievements.rarity.${achievement.rarity}`, achievement.rarity)}
                      </Badge>
                    </div>
                    
                    <p className="text-caption text-muted-foreground mb-2">
                      {achievement.locked 
                        ? t(`screens.achievements.items.${achievement.id}.requirement`, achievement.requirement)
                        : t(`screens.achievements.items.${achievement.id}.description`, achievement.description)}
                    </p>

                    {!achievement.locked && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-caption">
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                          <span className="text-primary font-medium">
                            {formatReward(achievement.reward)}
                          </span>
                        </div>
                        
                        {!achievement.completed && (
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="quests" className="space-y-3">
          {quests.map((quest) => (
            <Card key={quest.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-xl">
                    {quest.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-body font-medium">{t(`screens.achievements.quests.${quest.id}.name`, quest.name)}</h4>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-micro text-muted-foreground">{quest.timeLeft}</span>
                      </div>
                    </div>
                    
                    <p className="text-caption text-muted-foreground mb-2">
                      {t(`screens.achievements.quests.${quest.id}.description`, quest.description)}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-caption">
                        <span>
                          {quest.progress}/{quest.maxProgress}
                        </span>
                        <span className="text-primary font-medium">
                          {formatReward(quest.reward)}
                        </span>
                      </div>
                      
                      <Progress 
                        value={(quest.progress / quest.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant={quest.type === 'daily' ? 'default' : quest.type === 'weekly' ? 'secondary' : 'outline'}
                        className="text-micro"
                      >
                        {quest.type === 'daily' ? t('screens.achievements.badges.daily', 'Täglich') : quest.type === 'weekly' ? t('screens.achievements.badges.weekly', 'Wöchentlich') : t('screens.achievements.badges.seasonal', 'Saison')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Quest Store Preview */}
          <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-dashed">
            <CardContent className="p-4 text-center">
              <Gift className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="text-body font-medium mb-1">{t('screens.achievements.store.title', 'Quest-Belohnungen')}</h4>
              <p className="text-caption text-muted-foreground mb-3">
                {t('screens.achievements.store.description', 'Sammle Quest-Punkte und tausche sie gegen wertvolle Belohnungen ein')}
              </p>
              <Button variant="outline" size="sm" disabled>
                {t('screens.achievements.store.comingSoon', 'Bald verfügbar')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
