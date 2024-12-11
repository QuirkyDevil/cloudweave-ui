import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div style={{ margin: '2rem auto', maxWidth: '400px' }}>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}
