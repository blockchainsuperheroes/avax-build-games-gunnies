'use client';

import SectionTop from '@components/Sections/SectionTop';
import SectionGroup from '@components/Sections/SectionGroup';
import { Suspense } from 'react';

function PageContent() {
  return (
    <section className="">
      <SectionTop />
      <SectionGroup />
    </section>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
