import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{ margin: '2rem auto', maxWidth: '400px' }}>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}
