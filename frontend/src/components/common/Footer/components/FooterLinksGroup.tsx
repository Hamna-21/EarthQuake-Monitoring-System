import React from 'react';

interface FooterLinksGroupProps {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

export default function FooterLinksGroup({ title, links }: FooterLinksGroupProps) {
  return (
    <div>
      <h3 className="mb-5 text-lg font-bold text-white">
        {title}
      </h3>
      <ul className="font-light space-y-3 text-red-100/70">
        {links.map((link, idx) => (
          <li key={idx}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="hover:text-orange-300 transition"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
