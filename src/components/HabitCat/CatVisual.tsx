import React, { Component, ErrorInfo, ReactNode } from 'react';
import { CatMood } from './habitTypes';
import { PixelCatRoom } from './PixelCatRoom';
import { CatActionType } from './PixelCatSprite';

interface CatVisualProps {
  mood: CatMood;
  level: number;
  catName: string;
  isSleeping?: boolean;
  isFeeding?: boolean;
  externalAction?: { action: CatActionType; quote?: string; duration?: number; key: number } | null;
  inactiveDays?: number;
  showBribeButton?: boolean;
  onBribe?: () => void;
  onBath?: () => void;
  onPet?: () => void;
  totalCompletedHabits?: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class CatErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Kedi odası yükleme hatası:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: 'linear-gradient(180deg, #1a1824 0%, #121118 100%)',
            borderRadius: 24,
            padding: 32,
            border: '2px solid rgba(245, 158, 11, 0.3)',
            textAlign: 'center',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 280,
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🐱💤</div>
          <h4 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 800, color: '#fbbf24' }}>
            Kedi Odası Hazırlanıyor...
          </h4>
          <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#a1a1aa', maxWidth: 280 }}>
            Kedicik odasını düzenlerken minik bir aksilik oldu, hemen toparlıyoruz.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              background: '#fbbf24',
              color: '#18181b',
              border: 'none',
              borderRadius: 12,
              padding: '8px 18px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Kedi Odasını Yenile 🐾
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const CatVisual: React.FC<CatVisualProps> = ({
  mood,
  level,
  catName,
  isSleeping = false,
  isFeeding = false,
  externalAction,
  inactiveDays = 0,
  showBribeButton = false,
  onBribe,
  onBath,
  onPet,
  totalCompletedHabits = 0,
}) => {
  return (
    <CatErrorBoundary>
      <PixelCatRoom
        mood={mood}
        level={level}
        catName={catName}
        isSleeping={isSleeping}
        isFeeding={isFeeding}
        externalAction={externalAction}
        inactiveDays={inactiveDays}
        showBribeButton={showBribeButton}
        onBribe={onBribe}
        onBath={onBath}
        onPet={onPet}
        totalCompletedHabits={totalCompletedHabits}
      />
    </CatErrorBoundary>
  );
};
