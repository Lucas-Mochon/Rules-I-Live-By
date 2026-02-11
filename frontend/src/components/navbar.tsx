'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useI18n} from '@/src/i18n/useI18n';

const navItems = [
  {key: 'profile', path: '/profile'},
  {key: 'rules', path: '/rules'},
  {key: 'fractures', path: '/broken'},
  {key: 'archive', path: '/archive'},
];

export default function Navbar() {
  const pathname = usePathname();
  const {t} = useI18n();

  return (
    <nav className="fixed left-4 top-1/6 -translate-y-1/2 z-50">
      <ul className="flex flex-col gap-4 rounded-2xl bg-orange-50 backdrop-blur-md shadow-lg px-3 py-4">
        {navItems.map((item) => {
          const active = pathname.includes(item.path);

          return (
            <li key={item.key}>
              <Link
                href={item.path}
                className={`
                  group flex items-center gap-3 px-3 py-2 rounded-xl
                  transition-all duration-300
                  ${active
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-700 hover:text-orange-500'}
                `}
              >
                <span
                  className={`
                    h-2 w-2 rounded-full
                    transition-opacity duration-300
                    ${active ? 'bg-white opacity-100' : 'bg-neutral-400 opacity-40'}
                  `}
                />

                <span className="text-sm tracking-wide">
                  {t(`nav.${item.key}`)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
