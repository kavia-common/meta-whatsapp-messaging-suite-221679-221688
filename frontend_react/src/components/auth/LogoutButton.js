import React from 'react';
import { logout } from '../../api/authApi';
import Button from '../common/Button';

/**
 * Button that logs the user out via backend and redirects to home.
 */

// PUBLIC_INTERFACE
export default function LogoutButton({ label = 'Sign out', className = '', redirectTo }) {
  /** A button that logs out the user.
   * Props:
   *  - label: text to display
   *  - className: extra classes
   *  - redirectTo: optional URL to redirect after logout
   */
  const onClick = async () => {
    await logout(redirectTo);
  };

  return (
    <Button onClick={onClick} className={className} variant="secondary">
      {label}
    </Button>
  );
}
