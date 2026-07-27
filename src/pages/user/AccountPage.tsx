import { motion } from 'framer-motion';
import { UserCog, Download, LogOut, UserX, Trash2, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function AccountPage() {
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Account Management</h1>
        <p className="text-sm text-muted-foreground">Manage your account data and session</p>
      </motion.div>

      {/* Data Management */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold">Data Management</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold">Export User Data</p>
              <p className="text-xs text-muted-foreground">Download all your data as JSON</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </Card>
          <Card className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold">Download Reports</p>
              <p className="text-xs text-muted-foreground">Generate monthly account reports</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </Card>
        </div>
      </section>

      {/* Session Management */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold">Session Management</h2>
        <Card className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-semibold">Logout From All Devices</p>
            <p className="text-xs text-muted-foreground">Sign out of all active sessions across all devices</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <LogOut className="h-3.5 w-3.5" />
            Logout All
          </Button>
        </Card>
      </section>

      {/* Danger Zone */}
      <section>
        <h2 className="mb-3 flex items-center gap-1.5 font-display text-base font-semibold text-danger">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="flex items-center justify-between border-danger/20 p-4">
            <div>
              <p className="text-sm font-semibold">Deactivate Account</p>
              <p className="text-xs text-muted-foreground">Temporarily disable your account</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-warning hover:text-warning" onClick={() => setShowDeactivate(true)}>
              <UserX className="h-3.5 w-3.5" />
              Deactivate
            </Button>
          </Card>
          <Card className="flex items-center justify-between border-danger/20 p-4">
            <div>
              <p className="text-sm font-semibold">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
            </div>
            <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => setShowDelete(true)}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </Card>
        </div>
      </section>

      {/* Deactivate Dialog */}
      <Dialog open={showDeactivate} onOpenChange={setShowDeactivate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserX className="h-5 w-5 text-warning" /> Deactivate Account</DialogTitle>
            <DialogDescription>Your account will be temporarily disabled. You can reactivate it by logging in again. Your data and portfolio will be preserved.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeactivate(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setShowDeactivate(false)}>Deactivate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Trash2 className="h-5 w-5 text-danger" /> Delete Account</DialogTitle>
            <DialogDescription>This action is permanent and cannot be undone. All your data, portfolio, and transaction history will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setShowDelete(false)}>Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
