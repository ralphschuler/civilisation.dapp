import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Village, VillageInfo, March, MarchPreset } from '../../types/game';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Badge } from '../ui/Badge';
import { MarchPlannerScreen } from './MarchPlannerScreen';
import { Route, MapPin, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useI18n } from '@/providers/i18n-provider';

interface WorldMapScreenProps {
  village: Village;
  marches: March[];
  marchPresets: MarchPreset[];
  onVillageSelect: (villageId: string) => void;
  onVillageInfo: (villageInfo: VillageInfo) => void;
  onCreateMarch: (march: Omit<March, 'id'>) => void;
  onCancelMarch: (marchId: string) => void;
  onCreatePreset: (preset: Omit<MarchPreset, 'id'>) => void;
  onDeletePreset: (presetId: string) => void;
}

// Map configuration - 500x500 chunks
const CHUNK_SIZE = 100; // units per chunk
const CHUNKS_WIDTH = 500;
const CHUNKS_HEIGHT = 500;
const MAP_WIDTH = CHUNK_SIZE * CHUNKS_WIDTH; // 50000 units
const MAP_HEIGHT = CHUNK_SIZE * CHUNKS_HEIGHT; // 50000 units
const MIN_VILLAGES_PER_CHUNK = 5; // Minimum villages per chunk
const MAX_VILLAGES_PER_CHUNK = 10; // Maximum villages per chunk
const CHUNK_LOAD_RADIUS = 3; // Load chunks in a 3-chunk radius around viewport

// Village names and player names for generation
const VILLAGE_NAMES = [
  'Barbarendorf', 'Nordlicht', 'Südwind', 'Ostwall', 'Westgrund', 'Bergfeste',
  'Nordgrenze', 'Südhafen', 'Ostwacht', 'Westfeste', 'Zentrum', 'Räuberlager',
  'Steinburg', 'Waldheim', 'Eisenstadt', 'Felsenburg', 'Talheim', 'Seeburg',
  'Wüstenlager', 'Schneefeste', 'Drachenhort', 'Adlernest', 'Wolfsrudel', 'Bärenhöhle',
  'Silberturm', 'Goldgrube', 'Kupfertal', 'Bronzeburg', 'Stahlstadt', 'Eisenfeste',
  'Rabenhorst', 'Falkenruh', 'Adlerstein', 'Wolfstal', 'Bärengrund', 'Löwenburg',
  'Rosenfeld', 'Lilienau', 'Veilchental', 'Nelkenheim', 'Orchideenstadt', 'Tulpenfeld',
  'Eichenhain', 'Buchental', 'Ahorngrund', 'Birkenfeld', 'Kastanienstadt', 'Lindenhof'
];

const PLAYER_NAMES = [
  'Viking_King', 'Desert_Lord', 'Iron_Fist', 'Mountain_King', 'Sea_Lord',
  'Dawn_Rider', 'Sunset_King', 'Heart_Emperor', 'Rock_Hammer', 'Steel_Baron',
  'Fire_Lord', 'Ice_Queen', 'Storm_Bringer', 'Shadow_Master', 'Light_Keeper',
  'Night_Blade', 'Sun_Warrior', 'Moon_Knight', 'Star_Ranger', 'Sky_Guardian',
  'Earth_Shaker', 'Wind_Runner', 'Water_Bearer', 'Thunder_God', 'Lightning_Strike'
];

// Seeded random number generator for consistent chunk generation
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate chunk key from chunk coordinates
function getChunkKey(chunkX: number, chunkY: number): string {
  return `${chunkX},${chunkY}`;
}

// Generate villages for a specific chunk
function generateVillagesForChunk(chunkX: number, chunkY: number): Array<{
  id: string;
  name: string;
  x: number;
  y: number;
  level: number;
  player: string | null;
}> {
  const villages = [];
  const chunkSeed = chunkX * 1000000 + chunkY;
  
  // Determine number of villages in this chunk (5-10)
  const seed1 = seededRandom(chunkSeed);
  const numVillages = Math.floor(seed1 * (MAX_VILLAGES_PER_CHUNK - MIN_VILLAGES_PER_CHUNK + 1)) + MIN_VILLAGES_PER_CHUNK;
  
  for (let i = 0; i < numVillages; i++) {
    const villageSeed = chunkSeed + i * 100;
    
    // Position within chunk (with some padding from edges)
    const xOffset = seededRandom(villageSeed * 2) * (CHUNK_SIZE - 20) + 10;
    const yOffset = seededRandom(villageSeed * 3) * (CHUNK_SIZE - 20) + 10;
    
    const x = chunkX * CHUNK_SIZE + xOffset;
    const y = chunkY * CHUNK_SIZE + yOffset;
    
    // Random attributes
    const nameIndex = Math.floor(seededRandom(villageSeed * 5) * VILLAGE_NAMES.length);
    const level = Math.floor(seededRandom(villageSeed * 7) * 25) + 1;
    const hasPlayer = seededRandom(villageSeed * 11) > 0.3; // 70% have players
    const playerIndex = Math.floor(seededRandom(villageSeed * 13) * PLAYER_NAMES.length);
    
    villages.push({
      id: `chunk_${chunkX}_${chunkY}_v${i}`,
      name: VILLAGE_NAMES[nameIndex],
      x,
      y,
      level,
      player: hasPlayer ? PLAYER_NAMES[playerIndex] : null
    });
  }
  
  return villages;
}

export function WorldMapScreen({ 
  village, 
  marches,
  marchPresets,
  onVillageSelect, 
  onVillageInfo,
  onCreateMarch,
  onCancelMarch,
  onCreatePreset,
  onDeletePreset
}: WorldMapScreenProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('map');
  const [selectedTarget, setSelectedTarget] = useState<VillageInfo | null>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 400, height: 384 });
  const [loadedChunks, setLoadedChunks] = useState<Set<string>>(new Set());
  const [generatedVillages, setGeneratedVillages] = useState<Map<string, any[]>>(new Map());
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const myVillagePosition = { x: village.x || MAP_WIDTH / 2, y: village.y || MAP_HEIGHT / 2 };

  // Touch/Pan state
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef({ x: 0, y: 0 });
  const lastTouchDistanceRef = useRef<number | null>(null);
  const lastViewBoxRef = useRef(viewBox);

  const MIN_ZOOM = 0.3;   // More zoomed out (larger viewBox)
  const MAX_ZOOM = 20;    // More zoomed in (smaller viewBox) - allows reading village names

  // Get all villages from all loaded chunks
  const allVillages = useMemo(() => {
    const villages: any[] = [];
    generatedVillages.forEach((chunkVillages) => {
      villages.push(...chunkVillages);
    });
    return villages;
  }, [generatedVillages]);

  // Load chunks in viewport
  const loadVisibleChunks = useCallback(() => {
    // Calculate which chunks are visible in current viewBox
    const startChunkX = Math.max(0, Math.floor(viewBox.x / CHUNK_SIZE) - CHUNK_LOAD_RADIUS);
    const endChunkX = Math.min(CHUNKS_WIDTH - 1, Math.floor((viewBox.x + viewBox.width) / CHUNK_SIZE) + CHUNK_LOAD_RADIUS);
    const startChunkY = Math.max(0, Math.floor(viewBox.y / CHUNK_SIZE) - CHUNK_LOAD_RADIUS);
    const endChunkY = Math.min(CHUNKS_HEIGHT - 1, Math.floor((viewBox.y + viewBox.height) / CHUNK_SIZE) + CHUNK_LOAD_RADIUS);

    const newLoadedChunks = new Set<string>(loadedChunks);
    const newGeneratedVillages = new Map(generatedVillages);
    let hasNewChunks = false;

    // Load chunks in range
    for (let chunkX = startChunkX; chunkX <= endChunkX; chunkX++) {
      for (let chunkY = startChunkY; chunkY <= endChunkY; chunkY++) {
        const chunkKey = getChunkKey(chunkX, chunkY);
        
        if (!newLoadedChunks.has(chunkKey)) {
          // Generate villages for this chunk
          const villages = generateVillagesForChunk(chunkX, chunkY);
          newGeneratedVillages.set(chunkKey, villages);
          newLoadedChunks.add(chunkKey);
          hasNewChunks = true;
        }
      }
    }

    if (hasNewChunks) {
      setLoadedChunks(newLoadedChunks);
      setGeneratedVillages(newGeneratedVillages);
    }
  }, [viewBox, loadedChunks, generatedVillages]);

  // Load initial chunks
  useEffect(() => {
    loadVisibleChunks();
  }, [loadVisibleChunks]);

  // Center on player village on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialViewBoxWidth = container.clientWidth;
    const initialViewBoxHeight = container.clientHeight;
    
    setViewBox({
      x: myVillagePosition.x - initialViewBoxWidth / 2,
      y: myVillagePosition.y - initialViewBoxHeight / 2,
      width: initialViewBoxWidth,
      height: initialViewBoxHeight
    });
  }, []);

  // Handle zoom (modify viewBox size)
  const handleZoom = (delta: number, centerX?: number, centerY?: number) => {
    const zoomFactor = 1 + delta;
    const newWidth = viewBox.width / zoomFactor;
    const newHeight = viewBox.height / zoomFactor;

    // Clamp zoom
    const currentZoom = 400 / viewBox.width;
    const newZoom = currentZoom * zoomFactor;
    if (newZoom < MIN_ZOOM || newZoom > MAX_ZOOM) return;

    let newX = viewBox.x;
    let newY = viewBox.y;

    if (centerX !== undefined && centerY !== undefined) {
      // Zoom towards specific point
      const relativeX = (centerX - viewBox.x) / viewBox.width;
      const relativeY = (centerY - viewBox.y) / viewBox.height;
      
      newX = centerX - newWidth * relativeX;
      newY = centerY - newHeight * relativeY;
    } else {
      // Zoom towards center
      newX = viewBox.x + (viewBox.width - newWidth) / 2;
      newY = viewBox.y + (viewBox.height - newHeight) / 2;
    }

    // Apply wrapping
    newX = ((newX % MAP_WIDTH) + MAP_WIDTH) % MAP_WIDTH;
    newY = ((newY % MAP_HEIGHT) + MAP_HEIGHT) % MAP_HEIGHT;

    setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
  };

  const zoomIn = () => handleZoom(0.2);
  const zoomOut = () => handleZoom(-0.2);

  // Scroll/Pan map
  const scrollMap = (direction: 'up' | 'down' | 'left' | 'right') => {
    const panDistance = viewBox.width * 0.8;
    let newX = viewBox.x;
    let newY = viewBox.y;

    switch (direction) {
      case 'up':
        newY -= panDistance;
        break;
      case 'down':
        newY += panDistance;
        break;
      case 'left':
        newX -= panDistance;
        break;
      case 'right':
        newX += panDistance;
        break;
    }

    // Apply wrapping
    newX = ((newX % MAP_WIDTH) + MAP_WIDTH) % MAP_WIDTH;
    newY = ((newY % MAP_HEIGHT) + MAP_HEIGHT) % MAP_HEIGHT;

    setViewBox({ ...viewBox, x: newX, y: newY });
  };

  // Mouse/Touch handlers for pan and zoom
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Only left click
    isPanningRef.current = true;
    lastPanPointRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanningRef.current) return;

    const dx = e.clientX - lastPanPointRef.current.x;
    const dy = e.clientY - lastPanPointRef.current.y;

    const scale = viewBox.width / (svgRef.current?.clientWidth || 1);
    let newX = viewBox.x - dx * scale;
    let newY = viewBox.y - dy * scale;

    // Apply wrapping
    newX = ((newX % MAP_WIDTH) + MAP_WIDTH) % MAP_WIDTH;
    newY = ((newY % MAP_HEIGHT) + MAP_HEIGHT) % MAP_HEIGHT;

    setViewBox({ ...viewBox, x: newX, y: newY });
    lastPanPointRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isPanningRef.current = false;
  };

  const handleMouseLeave = () => {
    isPanningRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    
    // Get mouse position in SVG coordinates
    const svg = svgRef.current;
    if (!svg) return;
    
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const svgX = viewBox.x + (mouseX / rect.width) * viewBox.width;
    const svgY = viewBox.y + (mouseY / rect.height) * viewBox.height;
    
    handleZoom(delta, svgX, svgY);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      isPanningRef.current = true;
      lastPanPointRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      isPanningRef.current = false;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      lastTouchDistanceRef.current = distance;
      lastViewBoxRef.current = { ...viewBox };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isPanningRef.current) {
      // Pan
      const dx = e.touches[0].clientX - lastPanPointRef.current.x;
      const dy = e.touches[0].clientY - lastPanPointRef.current.y;

      const scale = viewBox.width / (svgRef.current?.clientWidth || 1);
      let newX = viewBox.x - dx * scale;
      let newY = viewBox.y - dy * scale;

      // Apply wrapping
      newX = ((newX % MAP_WIDTH) + MAP_WIDTH) % MAP_WIDTH;
      newY = ((newY % MAP_HEIGHT) + MAP_HEIGHT) % MAP_HEIGHT;

      setViewBox({ ...viewBox, x: newX, y: newY });
      lastPanPointRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && lastTouchDistanceRef.current !== null) {
      // Pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scale = distance / lastTouchDistanceRef.current;
      const newWidth = lastViewBoxRef.current.width / scale;
      const newHeight = lastViewBoxRef.current.height / scale;

      // Clamp zoom
      const currentZoom = 400 / lastViewBoxRef.current.width;
      const newZoom = currentZoom * scale;
      if (newZoom < MIN_ZOOM || newZoom > MAX_ZOOM) return;

      // Center of pinch
      const svg = svgRef.current;
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const centerClientX = (touch1.clientX + touch2.clientX) / 2;
      const centerClientY = (touch1.clientY + touch2.clientY) / 2;
      const centerX = lastViewBoxRef.current.x + ((centerClientX - rect.left) / rect.width) * lastViewBoxRef.current.width;
      const centerY = lastViewBoxRef.current.y + ((centerClientY - rect.top) / rect.height) * lastViewBoxRef.current.height;

      const relativeX = (centerX - lastViewBoxRef.current.x) / lastViewBoxRef.current.width;
      const relativeY = (centerY - lastViewBoxRef.current.y) / lastViewBoxRef.current.height;

      let newX = centerX - newWidth * relativeX;
      let newY = centerY - newHeight * relativeY;

      // Apply wrapping
      newX = ((newX % MAP_WIDTH) + MAP_WIDTH) % MAP_WIDTH;
      newY = ((newY % MAP_HEIGHT) + MAP_HEIGHT) % MAP_HEIGHT;

      setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length < 2) {
      lastTouchDistanceRef.current = null;
    }
    if (e.touches.length === 0) {
      isPanningRef.current = false;
    }
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const getVillageIcon = (villageData: any) => {
    if (!villageData.player) return '🏴‍☠️'; // Barbarendorf
    if (villageData.level < 10) return '🏘️';
    if (villageData.level < 20) return '🏰';
    return '👑'; // Große Festung
  };

  const generateVillageInfo = (villageData: any): VillageInfo => {
    const basePopulation = villageData.level * 240;
    const armySize = villageData.player ? Math.floor(Math.random() * 500) + 100 : Math.floor(Math.random() * 200) + 50;
    
    return {
      id: villageData.id,
      name: villageData.name,
      x: villageData.x,
      y: villageData.y,
      level: villageData.level,
      player: villageData.player,
      points: villageData.level * 1000 + Math.floor(Math.random() * 2000),
      population: Math.floor(basePopulation * (0.7 + Math.random() * 0.3)),
      maxPopulation: basePopulation,
      buildings: {
        townhall: Math.min(villageData.level, 30),
        barracks: villageData.player ? Math.floor(villageData.level * 0.8) : Math.floor(villageData.level * 0.5),
        wall: villageData.player ? Math.floor(villageData.level * 0.9) : Math.floor(villageData.level * 0.3),
        storage: Math.floor(villageData.level * 0.7),
        market: villageData.player ? Math.floor(villageData.level * 0.6) : 0,
        farm: Math.floor(villageData.level * 0.8)
      },
      army: {
        spearman: Math.floor(armySize * 0.4),
        swordsman: Math.floor(armySize * 0.3),
        archer: Math.floor(armySize * 0.2),
        knight: Math.floor(armySize * 0.08),
        trebuchet: Math.floor(armySize * 0.02)
      },
      wall: villageData.player ? Math.floor(villageData.level * 0.9) : Math.floor(villageData.level * 0.3),
      lastActivity: villageData.player ? 
        ['vor 5min', 'vor 2h', 'vor 1d', 'vor 3d'][Math.floor(Math.random() * 4)] : 
        'Barbarendorf',
      alliance: villageData.player && Math.random() > 0.5 ? 
        ['Die Krieger', 'Nordwind', 'Eisenfaust', 'Goldene Horde'][Math.floor(Math.random() * 4)] : 
        undefined,
      playerRank: villageData.player ? Math.floor(Math.random() * 1000) + 1 : undefined,
      defenseBonus: villageData.player ? 
        Math.floor(villageData.level * 2) + Math.floor(Math.random() * 50) : 
        Math.floor(villageData.level * 1)
    };
  };

  const handleVillageClick = (villageData: any) => {
    if (villageData.id === village.id) {
      onVillageSelect(villageData.id);
    } else {
      const villageInfo = generateVillageInfo(villageData);
      if (activeTab === 'march-planner') {
        setSelectedTarget(villageInfo);
      } else {
        onVillageInfo(villageInfo);
      }
    }
  };

  const handleAttackClick = (villageData: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const villageInfo = generateVillageInfo(villageData);
    setSelectedTarget(villageInfo);
    setActiveTab('march-planner');
  };

  const activeMarchesCount = marches.filter(m => ['planning', 'marching', 'arrived'].includes(m.status)).length;
  const currentZoom = 400 / viewBox.width;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t('screens.world.title', 'Welt & Märsche')}
            </div>
            <span className="text-sm text-muted-foreground">
              {t('screens.world.coords', 'Koordinaten')}: ({Math.floor(myVillagePosition.x / CHUNK_SIZE)}|{Math.floor(myVillagePosition.y / CHUNK_SIZE)})
            </span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="map">
            <MapPin className="h-4 w-4 mr-2" />
            {t('screens.world.tabs.map', 'Karte')}
          </TabsTrigger>
          <TabsTrigger value="march-planner">
            <Route className="h-4 w-4 mr-2" />
            {t('screens.world.tabs.planner', 'Marschplaner')}
            {activeMarchesCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {activeMarchesCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <div className="space-y-4">
            {/* Map View with Scroll Controls */}
            <Card>
              <CardContent className="p-2">
                <div className="relative">
                  {/* Scroll Controls - Always visible ghost buttons */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-1/2 -translate-x-1/2 z-10 min-touch hover:bg-background/50"
                    onClick={() => scrollMap('up')}
                    aria-label={t('screens.world.scroll.up', 'Nach oben scrollen')}
                  >
                    <ChevronUp className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 min-touch hover:bg-background/50"
                    onClick={() => scrollMap('down')}
                    aria-label={t('screens.world.scroll.down', 'Nach unten scrollen')}
                  >
                    <ChevronDown className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-2 -translate-y-1/2 z-10 min-touch hover:bg-background/50"
                    onClick={() => scrollMap('left')}
                    aria-label={t('screens.world.scroll.left', 'Nach links scrollen')}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 -translate-y-1/2 z-10 min-touch hover:bg-background/50"
                    onClick={() => scrollMap('right')}
                    aria-label={t('screens.world.scroll.right', 'Nach rechts scrollen')}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>

                  {/* Zoom Controls - Bottom right corner */}
                  <div className="absolute bottom-2 right-2 z-10 flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="min-touch hover:bg-background/50"
                      onClick={zoomIn}
                      disabled={currentZoom >= MAX_ZOOM}
                      aria-label={t('screens.world.zoom.in', 'Hineinzoomen')}
                    >
                      <ZoomIn className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="min-touch hover:bg-background/50"
                      onClick={zoomOut}
                      disabled={currentZoom <= MIN_ZOOM}
                      aria-label={t('screens.world.zoom.out', 'Herauszoomen')}
                    >
                      <ZoomOut className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Zoom Level Indicator */}
                  <div className="absolute top-2 right-2 z-10 bg-background/80 px-2 py-1 rounded text-xs">
                    {Math.round(currentZoom * 100)}%
                  </div>

                  {/* Chunk Counter - Top left */}
                  <div className="absolute top-2 left-2 z-10 bg-background/80 px-2 py-1 rounded text-xs">
                    Chunks: {loadedChunks.size} | Dörfer: {allVillages.length}
                  </div>

                  {/* SVG Map Container */}
                  <div 
                    ref={containerRef}
                    className="w-full h-96 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800"
                  >
                    <svg
                      ref={svgRef}
                      className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
                      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                      onWheel={handleWheel}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* Background */}
                      <rect
                        x={viewBox.x}
                        y={viewBox.y}
                        width={viewBox.width}
                        height={viewBox.height}
                        fill="url(#mapGradient)"
                        pointerEvents="none"
                      />

                      {/* Gradients */}
                      <defs>
                        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#dcfce7" />
                          <stop offset="100%" stopColor="#bbf7d0" />
                        </linearGradient>
                      </defs>

                      {/* Grid lines - render only visible ones */}
                      <g opacity="0.2" stroke="#666" strokeWidth={viewBox.width / 400}>
                        {Array.from({ length: Math.ceil(viewBox.width / CHUNK_SIZE) + 1 }).map((_, i) => {
                          const x = Math.floor(viewBox.x / CHUNK_SIZE) * CHUNK_SIZE + i * CHUNK_SIZE;
                          return (
                            <line
                              key={`v-${i}`}
                              x1={x}
                              y1={viewBox.y}
                              x2={x}
                              y2={viewBox.y + viewBox.height}
                            />
                          );
                        })}
                        {Array.from({ length: Math.ceil(viewBox.height / CHUNK_SIZE) + 1 }).map((_, i) => {
                          const y = Math.floor(viewBox.y / CHUNK_SIZE) * CHUNK_SIZE + i * CHUNK_SIZE;
                          return (
                            <line
                              key={`h-${i}`}
                              x1={viewBox.x}
                              y1={y}
                              x2={viewBox.x + viewBox.width}
                              y2={y}
                            />
                          );
                        })}
                      </g>

                      {/* My Village */}
                      <g
                        onClick={() => onVillageSelect(village.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <circle
                          cx={myVillagePosition.x}
                          cy={myVillagePosition.y}
                          r={Math.max(viewBox.width / 40, 8)}
                          fill="#3b82f6"
                          stroke="#93c5fd"
                          strokeWidth={Math.max(viewBox.width / 200, 1)}
                        />
                        <text
                          x={myVillagePosition.x}
                          y={myVillagePosition.y + viewBox.width / 100}
                          textAnchor="middle"
                          fill="white"
                          fontSize={Math.max(viewBox.width / 30, 16)}
                          pointerEvents="none"
                        >
                          🏰
                        </text>
                        <text
                          x={myVillagePosition.x}
                          y={myVillagePosition.y - viewBox.width / 40}
                          textAnchor="middle"
                          fill="#3b82f6"
                          fontSize={Math.max(viewBox.width / 40, 12)}
                          fontWeight="600"
                          stroke="white"
                          strokeWidth={Math.max(viewBox.width / 400, 0.5)}
                          paintOrder="stroke"
                          pointerEvents="none"
                        >
                          {village.name}
                        </text>
                      </g>

                      {/* Generated Villages */}
                      {allVillages.map((otherVillage) => (
                        <g
                          key={otherVillage.id}
                          onClick={() => handleVillageClick(otherVillage)}
                          style={{ cursor: 'pointer' }}
                        >
                          <circle
                            cx={otherVillage.x}
                            cy={otherVillage.y}
                            r={Math.max(viewBox.width / 60, 6)}
                            fill={otherVillage.player ? '#ef4444' : '#6b7280'}
                            stroke={otherVillage.player ? '#fca5a5' : '#9ca3af'}
                            strokeWidth={Math.max(viewBox.width / 300, 0.8)}
                          />
                          <text
                            x={otherVillage.x}
                            y={otherVillage.y + viewBox.width / 150}
                            textAnchor="middle"
                            fill="white"
                            fontSize={Math.max(viewBox.width / 50, 12)}
                            pointerEvents="none"
                          >
                            {getVillageIcon(otherVillage)}
                          </text>
                          {currentZoom > 0.8 && (
                            <text
                              x={otherVillage.x}
                              y={otherVillage.y - viewBox.width / 60}
                              textAnchor="middle"
                              fill={otherVillage.player ? '#ef4444' : '#6b7280'}
                              fontSize={Math.max(viewBox.width / 50, 10)}
                              fontWeight="500"
                              pointerEvents="none"
                            >
                              {otherVillage.name}
                            </text>
                          )}
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Village List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Nahegelegene Dörfer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {allVillages
                  .sort((a, b) => {
                    const distA = calculateDistance(myVillagePosition.x, myVillagePosition.y, a.x, a.y);
                    const distB = calculateDistance(myVillagePosition.x, myVillagePosition.y, b.x, b.y);
                    return distA - distB;
                  })
                  .slice(0, 5)
                  .map((otherVillage) => {
                    const distance = Math.round(calculateDistance(
                      myVillagePosition.x, 
                      myVillagePosition.y, 
                      otherVillage.x, 
                      otherVillage.y
                    ) / CHUNK_SIZE);
                    
                    return (
                      <div 
                        key={otherVillage.id} 
                        className="flex items-center justify-between p-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => handleVillageClick(otherVillage)}
                      >
                        <div className="flex items-center gap-2">
                          <span>{getVillageIcon(otherVillage)}</span>
                          <div>
                            <div className="font-medium text-sm">{otherVillage.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {otherVillage.player ? `Spieler: ${otherVillage.player}` : 'Barbarendorf'} • 
                              Stufe {otherVillage.level} • 
                              ~{distance} Chunks
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs px-2 py-1 h-6 min-touch"
                            onClick={(e) => {
                              e.stopPropagation();
                              const villageInfo = generateVillageInfo(otherVillage);
                              onVillageInfo(villageInfo);
                            }}
                          >
                            👁️
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs px-2 py-1 h-6 min-touch"
                            onClick={(e) => handleAttackClick(otherVillage, e)}
                          >
                            ⚔️
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="march-planner">
          <MarchPlannerScreen
            village={village}
            marches={marches}
            marchPresets={marchPresets}
            onCreateMarch={onCreateMarch}
            onCancelMarch={onCancelMarch}
            onCreatePreset={onCreatePreset}
            onDeletePreset={onDeletePreset}
            selectedTarget={selectedTarget}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
