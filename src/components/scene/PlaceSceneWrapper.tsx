'use client';
import dynamic from 'next/dynamic';
import { PointOfInterestBase } from '@/lib/data/poi';
import LoadingScreen from '@/components/map/LoadingScreen';

const PlaceScene = dynamic(() => import('./PlaceScene'), { 
  ssr: false,
  loading: () => <LoadingScreen />
});

export default function PlaceSceneWrapper({ poi }: { poi: PointOfInterestBase }) {
  return <PlaceScene poi={poi} />;
}
