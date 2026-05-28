'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAssignmentStore } from '@/store/useAssignmentStore';
import { socket } from '@/lib/socket';

const statusMeta = {
  pending: {
    label: 'Queued',
    icon: Loader2,
    tone: 'text-amber-600',
    ring: 'border-amber-500/30 bg-amber-500/10',
  },
  processing: {
    label: 'Generating',
    icon: Loader2,
    tone: 'text-brand',
    ring: 'border-brand/30 bg-brand/10',
  },
  completed: {
    label: 'Ready',
    icon: CheckCircle2,
    tone: 'text-emerald-600',
    ring: 'border-emerald-500/30 bg-emerald-500/10',
  },
  failed: {
    label: 'Failed',
    icon: AlertCircle,
    tone: 'text-destructive',
    ring: 'border-destructive/30 bg-destructive/10',
  },
} as const;

export default function AssignmentStatusWidget() {
  const router = useRouter();
  const {
    activeAssignmentId,
    activeAssignmentTitle,
    activePaperId,
    generationStatus,
    setGenerationStatus,
    setActivePaperId,
    clearActiveAssignment,
  } = useAssignmentStore();

  useEffect(() => {
    const matchesActiveAssignment = (assignmentId?: string) => {
      return !activeAssignmentId || !assignmentId || assignmentId === activeAssignmentId;
    };

    const handleProcessing = (payload: { assignmentId?: string }) => {
      if (matchesActiveAssignment(payload.assignmentId)) {
        setGenerationStatus('processing');
      }
    };

    const handleCompleted = (payload: { assignmentId?: string; paperId: string }) => {
      if (matchesActiveAssignment(payload.assignmentId)) {
        setGenerationStatus('completed');
        setActivePaperId(payload.paperId);
        router.push(`/dashboard/paper/${payload.paperId}`);
      }
    };

    const handleFailed = (payload: { assignmentId?: string }) => {
      if (matchesActiveAssignment(payload.assignmentId)) {
        setGenerationStatus('failed');
      }
    };

    socket.connect();
    socket.on('generation-processing', handleProcessing);
    socket.on('generation-completed', handleCompleted);
    socket.on('generation-failed', handleFailed);

    return () => {
      socket.off('generation-processing', handleProcessing);
      socket.off('generation-completed', handleCompleted);
      socket.off('generation-failed', handleFailed);
    };
  }, [activeAssignmentId, router, setActivePaperId, setGenerationStatus]);

  if (!activeAssignmentId || generationStatus === 'idle') {
    return null;
  }

  const meta = statusMeta[generationStatus];
  const Icon = meta.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[320px] max-w-[calc(100vw-2rem)] pointer-events-none">
      <div className={`pointer-events-auto rounded-2xl border p-4 shadow-lg backdrop-blur ${meta.ring} bg-background/95`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${meta.ring}`}>
              <Icon className={`h-5 w-5 ${meta.tone} ${generationStatus === 'processing' || generationStatus === 'pending' ? 'animate-spin' : ''}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {activeAssignmentTitle || 'Generating assignment'}
              </p>
              <p className="text-xs text-muted-foreground">{meta.label}</p>
            </div>
          </div>

          <button
            onClick={clearActiveAssignment}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            aria-label="Dismiss status"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${generationStatus === 'failed' ? 'w-full bg-destructive' : generationStatus === 'completed' ? 'w-full bg-emerald-500' : 'w-2/3 bg-brand animate-pulse'}`}
          />
        </div>

        <div className="mt-4 flex gap-2">
          {generationStatus === 'completed' && activePaperId ? (
            <Button size="sm" className="flex-1 rounded-full" onClick={() => router.push(`/dashboard/paper/${activePaperId}`)}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Paper
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="flex-1 rounded-full" onClick={() => router.push('/dashboard/assignments')}>
              Open Assignments
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}