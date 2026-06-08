import { Joyride, EVENTS, STATUS, ACTIONS } from 'react-joyride'
import type { EventData, Controls, Step } from 'react-joyride'
import { useTourStore } from '@/stores/tourStore'

const steps: Step[] = [
  {
    target: '[data-tour="welcome"]',
    title: '👋 Welcome to EJJAR Admin',
    content: 'Admin oversees the entire EJJAR platform — suppliers, contractors, RFQs, taxonomy, and notifications all from one place.',
    placement: 'right',
    skipBeacon: true,
  },
  {
    target: '[data-tour="nav-dashboard"]',
    title: '📊 Dashboard',
    content: 'Real-time platform metrics — active RFQs, registered suppliers, contractors, and revenue at a glance.',
    placement: 'right',
    skipBeacon: true,
  },
  {
    target: '[data-tour="nav-suppliers"]',
    title: '🏗 Suppliers',
    content: 'Verify, block, or change subscription tier for any supplier on the platform.',
    placement: 'right',
    skipBeacon: true,
  },
  {
    target: '[data-tour="nav-contractors"]',
    title: '👷 Contractors',
    content: 'Manage contractor accounts — view activity, status, and account details.',
    placement: 'right',
    skipBeacon: true,
  },
  {
    target: '[data-tour="nav-rfqs"]',
    title: '📋 RFQs',
    content: 'Monitor all platform RFQs across every status — new, responded, confirmed, and completed.',
    placement: 'right',
    skipBeacon: true,
  },
  {
    target: '[data-tour="nav-taxonomy"]',
    title: '🏷 Taxonomy',
    content: 'Add new categories and subcategories that contractors use when posting RFQs.',
    placement: 'right',
    skipBeacon: true,
  },
  {
    target: '[data-tour="nav-notifications"]',
    title: '🔔 Notifications',
    content: 'View notification logs and templates sent to suppliers and contractors.',
    placement: 'right',
    skipBeacon: true,
  },
  {
    target: '[data-tour="settings"]',
    title: '⚙️ Settings',
    content: 'Platform configuration — manage admin accounts, roles, and system preferences.',
    placement: 'bottom',
    skipBeacon: true,
  },
]

export default function DemoTour() {
  const { isRunning, stepIndex, stopTour, setStepIndex } = useTourStore()

  const handleEvent = (data: EventData, _controls: Controls) => {
    const { status, type, index, action } = data

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      stopTour()
    }
  }

  return (
    <Joyride
      steps={steps}
      run={isRunning}
      stepIndex={stepIndex}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      options={{
        primaryColor: '#192433',
        overlayColor: 'rgba(15, 23, 42, 0.55)',
        zIndex: 10000,
        showProgress: true,
        buttons: ['back', 'primary', 'skip'],
        width: 340,
      }}
      styles={{
        tooltip: {
          borderRadius: 12,
          padding: '20px 24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        },
        tooltipTitle: {
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 8,
          color: '#0f172a',
        },
        tooltipContent: {
          padding: '4px 0 8px',
          lineHeight: 1.6,
          color: '#475569',
          fontSize: 13,
        },
        buttonPrimary: {
          backgroundColor: '#192433',
          borderRadius: 8,
          padding: '8px 18px',
          fontSize: 13,
          fontWeight: 600,
        },
        buttonBack: {
          color: '#64748b',
          fontSize: 13,
          fontWeight: 500,
          marginRight: 8,
        },
        buttonSkip: {
          color: '#94a3b8',
          fontSize: 12,
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        open: 'Open the dialog',
        skip: 'Skip tour',
      }}
    />
  )
}
