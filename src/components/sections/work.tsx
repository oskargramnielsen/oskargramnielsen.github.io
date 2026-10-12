'use client';

import type { Dict } from '@/content';
import Andelskortet from '../scenes/andelskortet';
import Bank from '../scenes/bank';
import Housing from '../scenes/housing';
import Scene from '../scenes/scene';
import Sneakers from '../scenes/sneakers';

export default function Work({ t }: { t: Dict['work'] }) {
  const shared = { forBusiness: t.forBusiness, replay: t.replay };
  return (
    <div id="work" className="scroll-mt-14">
      <div className="wrap pt-24 pb-4 md:pt-40 lg:pb-10">
        <h2 className="max-w-[900px] text-[clamp(32px,4.2vw,62px)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
          {t.title}
        </h2>
        <p className="mt-5 max-w-[600px] text-lg text-body md:mt-6 md:text-xl">{t.intro}</p>
      </div>

      <Scene id="housing" {...shared} {...t.housing} duration={8}>
        {(p) => <Housing p={p} t={t.housing} />}
      </Scene>
      <Scene id="sneakers" {...shared} {...t.sneakers} duration={6}>
        {(p) => <Sneakers p={p} t={t.sneakers} />}
      </Scene>
      <Scene id="andelskortet" {...shared} {...t.andelskortet} duration={8} tall="long">
        {(p) => <Andelskortet p={p} t={t.andelskortet} />}
      </Scene>
      <Scene id="bank" {...shared} {...t.bank} duration={7}>
        {(p) => <Bank p={p} t={t.bank} />}
      </Scene>
    </div>
  );
}
