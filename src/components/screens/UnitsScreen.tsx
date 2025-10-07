import { Village, Resources } from "../../types/game";
import { ArmyPanel } from "../ArmyPanel";

interface UnitsScreenProps {
  village: Village;
  resources: Resources;
  onTrainUnit: (unitId: string, quantity: number) => void;
}

export function UnitsScreen({ village, resources, onTrainUnit }: UnitsScreenProps) {
  return (
    <div className="space-y-4">
      <ArmyPanel
        army={village.army}
        buildings={village.buildings}
        resources={resources}
        onTrainUnit={onTrainUnit}
      />
    </div>
  );
}
