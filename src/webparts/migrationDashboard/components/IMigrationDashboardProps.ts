import { DisplayMode } from "@microsoft/sp-core-library";

export interface IMigrationDashboardProps {
  description: string;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
