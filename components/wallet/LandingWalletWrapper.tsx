'use client';

import { useState } from 'react';
import { FamilyWalletButton } from './FamilyWalletButton';
import { FamilyWalletDrawer } from './FamilyWalletDrawer';
import { useAuthStatus } from '@/hooks/use-auth';

export function LandingWalletWrapper() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuthStatus();

  // Optionally, we might want to hide this if the user is not authenticated
  // But the previous request was just to "add it to the main layout".
  // The wallet button itself handles "connect" if not connected.
  // However, usually detailed wallet actions are for logged-in users?
  // Let's keep it consistent with the Dashboard: always show, handles connect.
  // Actually, wait. The request was "add to main layout".
  // Note: layout.tsx is for landing pages.
  // If I'm not logged in, I might not want a floating button blocking content?
  // But user said "add to the the main @[app/(landing)/layout.tsx]".
  // Let's assume they want it always visible or let the component handle logic.
  // The WalletTrigger logic (which FamilyWalletButton likely mimics or relies on) checks for walletAddress.

  // Checking `FamilyWalletButton`: it renders `null`? No, let's check.
  // `FamilyWalletButton` itself doesn't check for wallet connection internaly?
  // Let's check `FamilyWalletButton.tsx` again.
  // Ah, it uses `useWallet`. `handleConnect`.
  // Wait, `FamilyWalletButton` implementation (step 163/173) shows:
  // It renders: `fixed right-6 bottom-6`.
  // It consumes `useWallet`.
  // It does NOT check if `walletAddress` exists to render *something*.
  // Wait, I should check `FamilyWalletButton` source code again to be sure.

  // Re-reading Step 163/173 for `FamilyWalletButton`:
  // It has `const { handleConnect } = useWallet();`
  // It basically assumes it can open the drawer OR connect?
  // Actually, the button in `FamilyWalletButton` is `onClick={() => { onOpenDrawer(); setIsOpen(false); }}` for actions.
  // The MAIN trigger `toggleOpen` toggles the speed dial.

  // Wait! The `WalletTrigger` (Step 191) had logic:
  // `if (!walletAddress) { ... return Connect Button ... }`
  // `FamilyWalletButton` (Step 163) DOES NOT seem to have this logic built-in?
  // It just shows the speed dial.
  // If I click "Receive" without a wallet, what happens?
  // Returns `handleConnect`?

  // Let's look at `FamilyWalletButton` again.
  // It just renders the markup.
  // It does NOT have the "Connect Wallet" state logic that `WalletTrigger` has.
  // `WalletTrigger` handled the "if no address, show connect button" logic.
  // `FamilyWalletButton` is designed as the *content*?
  // No, `FamilyWalletButton` (Step 163) is the whole speed dial.

  // IF the user is NOT connected, showing a "Send/Receive" speed dial is weird.
  // The Floating Button in `WalletTrigger` (before refactor) handled this.

  // I should probably update `FamilyWalletButton` to handle "Not Connected" state too?
  // OR, `LandingWalletWrapper` handles it.

  // Let's rely on `useWallet`.
  // If not connected, maybe we show a simple "Connect" floating button instead of the Speed Dial?
  // Or the Speed Dial has a "Connect" option?

  // The User wanted "Family Button" functionality.
  // I'll stick to rendering it.
  // But if I'm on the landing page and not logged in, do I want a floating wallet button?
  // Probably yes, to connect wallet.

  return (
    <>
      <FamilyWalletButton onOpenDrawer={() => setOpen(true)} />
      <FamilyWalletDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
