import { poiData } from '@/lib/data/poi';
import { journeyOrder } from '@/lib/data/journeyOrder';
import { useMapStore } from '@/lib/store';
import Marker from './Marker';

export default function Markers() {
  const { selectedCategory, activePoiIndex } = useMapStore();
  const activePoiId = journeyOrder[activePoiIndex]?.id;

  return (
    <group>
      {poiData.map((poi) => {
        const isFaded = selectedCategory !== null && selectedCategory !== poi.category;

        return (
          <Marker
            key={poi.id}
            poi={poi}
            isFaded={isFaded}
            isActive={poi.id === activePoiId}
          />
        );
      })}
    </group>
  );
}
