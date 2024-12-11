import { Lato } from 'next/font/google';
import { cookies } from 'next/headers';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from '@clerk/nextjs';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
});

export const metadata = {
  title: 'Cloudweave',
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className="h-full overflow-hidden">
          <SignedIn>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={defaultOpen}>
                <div className="flex h-full w-full">
                  <AppSidebar />
                  <SidebarTrigger />
                  <main className="flex-grow h-full">{children}</main>
                  <Toaster />
                </div>
              </SidebarProvider>
            </ThemeProvider>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
