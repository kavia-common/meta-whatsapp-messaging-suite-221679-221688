import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component representing a surface.
 */
// PUBLIC_INTERFACE
export default function Card({ title, subtitle, actions, children, footer }) {
  return (
    <section className="card" aria-label={typeof title === 'string' ? title : 'Card'}>
      {(title || actions || subtitle) ? (
        <header className="card__header">
          <div>
            {title ? <h3 className="card__title">{title}</h3> : null}
            {subtitle ? <div className="card__subtitle">{subtitle}</div> : null}
          </div>
          {actions ? <div className="card__actions">{actions}</div> : null}
        </header>
      ) : null}
      <div className="card__body">{children}</div>
      {footer ? <footer className="card__footer">{footer}</footer> : null}
    </section>
  );
}

Card.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  actions: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node
};
