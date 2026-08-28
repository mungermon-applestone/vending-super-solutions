import React from 'react';
import TranslatableText from '@/components/translation/TranslatableText';
import namaLogo from '@/assets/nama-logo.jpg.asset.json';

interface NamaMembershipProps {
  variant?: 'footer' | 'page';
  className?: string;
}

/**
 * Subtle NAMA membership badge used in the global footer and on the About page.
 */
const NamaMembership: React.FC<NamaMembershipProps> = ({ variant = 'footer', className = '' }) => {
  const isPage = variant === 'page';

  return (
    <div
      className={[
        'flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center sm:text-left',
        isPage ? 'rounded-lg border border-gray-200 bg-gray-50 px-5 py-4' : '',
        className,
      ].join(' ')}
    >
      <img
        src={namaLogo.url}
        alt="NAMA — National Automatic Merchandising Association"
        loading="lazy"
        className={[
          'block self-center object-contain shrink-0',
          isPage ? 'h-12 w-auto' : 'h-9 w-auto',
        ].join(' ')}
      />
      <p
        className={[
          'self-center m-0 text-gray-500 not-prose',
          isPage ? 'text-sm' : 'text-xs',
        ].join(' ')}
      >
        <TranslatableText context="footer">
          Applestone Solutions is a proud member of National Automatic Merchandising Association.
        </TranslatableText>
      </p>
    </div>
  );
};

export default NamaMembership;
