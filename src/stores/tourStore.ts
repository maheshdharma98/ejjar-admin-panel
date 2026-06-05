import { create } from 'zustand'

interface TourState {
  isRunning: boolean
  stepIndex: number
  startTour: () => void
  stopTour: () => void
  setStepIndex: (index: number) => void
}

export const useTourStore = create<TourState>((set) => ({
  isRunning: false,
  stepIndex: 0,
  startTour: () => set({ isRunning: true, stepIndex: 0 }),
  stopTour: () => set({ isRunning: false, stepIndex: 0 }),
  setStepIndex: (index) => set({ stepIndex: index }),
}))
