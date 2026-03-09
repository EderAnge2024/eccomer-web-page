// Componente Card reutilizable
import clsx from 'clsx';

const Card = ({ 
  children, 
  className, 
  padding = 'md',
  shadow = 'sm',
  hover = false,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };
  
  const classes = clsx(
    'bg-white rounded-lg border border-secondary-200',
    paddingClasses[padding],
    shadowClasses[shadow],
    {
      'hover:shadow-md transition-shadow duration-200': hover,
    },
    className
  );
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Subcomponentes
Card.Header = ({ children, className, ...props }) => (
  <div className={clsx('border-b border-secondary-200 pb-4 mb-4', className)} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className, ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className, ...props }) => (
  <div className={clsx('border-t border-secondary-200 pt-4 mt-4', className)} {...props}>
    {children}
  </div>
);

export default Card;