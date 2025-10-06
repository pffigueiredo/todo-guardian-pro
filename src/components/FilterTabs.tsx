import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type FilterType = "all" | "active" | "completed";

interface FilterTabsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

const FilterTabs = ({ currentFilter, onFilterChange, counts }: FilterTabsProps) => {
  return (
    <Tabs value={currentFilter} onValueChange={(v) => onFilterChange(v as FilterType)}>
      <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
        <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground">
          All ({counts.all})
        </TabsTrigger>
        <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground">
          Active ({counts.active})
        </TabsTrigger>
        <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-primary-foreground">
          Completed ({counts.completed})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default FilterTabs;
