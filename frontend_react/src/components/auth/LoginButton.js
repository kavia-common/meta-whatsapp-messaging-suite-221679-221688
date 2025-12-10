import React from 'react';
import { getLoginUrl } from '../../api/authApi';
import Button from '../common/Button';

/**
 * Button that redirects the user to the backend login page.
 */

// PUBLIC_INTERFACE
export default function LoginButton({ label = 'Sign in', className = '', redirectTo }) {
  /** A button that redirects the current tab to the login URL.
   * Props:
   *  - label: text to display on the button
   *  - className: additional class names
   *  - redirectTo: optional absolute URL to return to after login
   */
  const onClick = () => {
    const url = getLoginUrl(redirectTo);
    window.location.assign(url);
  };

  return (
    <Button onClick={onClick} className={className} variant="primary">
      {label}
    </Button>
  );
}
