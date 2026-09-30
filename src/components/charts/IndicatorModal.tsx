import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { DEFAULT_INDICATOR_SETTINGS, type IndicatorSettings } from '@/lib/indicators';

interface IndicatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: IndicatorSettings;
  onSave: (settings: IndicatorSettings) => void;
}

export function IndicatorModal({
  open,
  onOpenChange,
  settings,
  onSave,
}: IndicatorModalProps) {
  const [draft, setDraft] = useState<IndicatorSettings>(settings);

  const handleReset = () => {
    setDraft(DEFAULT_INDICATOR_SETTINGS);
  };

  const handleApply = () => {
    onSave(draft);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Chart Indicators & Overlays</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2 text-sm">
          {/* OVERLAYS */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Price Overlays
            </h4>
            <div className="space-y-3">
              {/* SMA */}
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2.5">
                <div className="space-y-0.5">
                  <Label htmlFor="sma" className="font-medium">Simple Moving Average (SMA)</Label>
                  <p className="text-xs text-muted-foreground">Smooth trend indicator</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="2"
                    max="200"
                    value={draft.smaPeriod}
                    disabled={!draft.showSma}
                    onChange={(e) => setDraft({ ...draft, smaPeriod: Number(e.target.value) || 20 })}
                    className="h-7 w-16 text-center text-xs"
                  />
                  <Switch
                    id="sma"
                    checked={draft.showSma}
                    onCheckedChange={(c) => setDraft({ ...draft, showSma: c })}
                  />
                </div>
              </div>

              {/* EMA */}
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2.5">
                <div className="space-y-0.5">
                  <Label htmlFor="ema" className="font-medium">Exponential Moving Average (EMA)</Label>
                  <p className="text-xs text-muted-foreground">Weighted fast trend indicator</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="2"
                    max="200"
                    value={draft.emaPeriod}
                    disabled={!draft.showEma}
                    onChange={(e) => setDraft({ ...draft, emaPeriod: Number(e.target.value) || 50 })}
                    className="h-7 w-16 text-center text-xs"
                  />
                  <Switch
                    id="ema"
                    checked={draft.showEma}
                    onCheckedChange={(c) => setDraft({ ...draft, showEma: c })}
                  />
                </div>
              </div>

              {/* Bollinger Bands */}
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2.5">
                <div className="space-y-0.5">
                  <Label htmlFor="bollinger" className="font-medium">Bollinger Bands (BB)</Label>
                  <p className="text-xs text-muted-foreground">Volatility & standard deviation bands</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="5"
                    max="100"
                    value={draft.bbPeriod}
                    disabled={!draft.showBollinger}
                    onChange={(e) => setDraft({ ...draft, bbPeriod: Number(e.target.value) || 20 })}
                    className="h-7 w-14 text-center text-xs"
                  />
                  <Switch
                    id="bollinger"
                    checked={draft.showBollinger}
                    onCheckedChange={(c) => setDraft({ ...draft, showBollinger: c })}
                  />
                </div>
              </div>

              {/* VWAP */}
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2.5">
                <div className="space-y-0.5">
                  <Label htmlFor="vwap" className="font-medium">VWAP (Volume-Weighted Avg Price)</Label>
                  <p className="text-xs text-muted-foreground">Institutional benchmark price</p>
                </div>
                <Switch
                  id="vwap"
                  checked={draft.showVwap}
                  onCheckedChange={(c) => setDraft({ ...draft, showVwap: c })}
                />
              </div>
            </div>
          </div>

          {/* LOWER PANES */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Oscillators & Lower Panes
            </h4>
            <div className="space-y-3">
              {/* RSI */}
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2.5">
                <div className="space-y-0.5">
                  <Label htmlFor="rsi" className="font-medium">Relative Strength Index (RSI)</Label>
                  <p className="text-xs text-muted-foreground">Overbought (&gt;70) & Oversold (&lt;30)</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="2"
                    max="50"
                    value={draft.rsiPeriod}
                    disabled={!draft.showRsi}
                    onChange={(e) => setDraft({ ...draft, rsiPeriod: Number(e.target.value) || 14 })}
                    className="h-7 w-14 text-center text-xs"
                  />
                  <Switch
                    id="rsi"
                    checked={draft.showRsi}
                    onCheckedChange={(c) => setDraft({ ...draft, showRsi: c })}
                  />
                </div>
              </div>

              {/* MACD */}
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2.5">
                <div className="space-y-0.5">
                  <Label htmlFor="macd" className="font-medium">MACD (12/26/9)</Label>
                  <p className="text-xs text-muted-foreground">Moving Average Convergence Divergence</p>
                </div>
                <Switch
                  id="macd"
                  checked={draft.showMacd}
                  onCheckedChange={(c) => setDraft({ ...draft, showMacd: c })}
                />
              </div>

              {/* Volume */}
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-2.5">
                <div className="space-y-0.5">
                  <Label htmlFor="vol" className="font-medium">Volume Bars</Label>
                  <p className="text-xs text-muted-foreground">Color-coded trade volume</p>
                </div>
                <Switch
                  id="vol"
                  checked={draft.showVolume}
                  onCheckedChange={(c) => setDraft({ ...draft, showVolume: c })}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply Indicators
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
