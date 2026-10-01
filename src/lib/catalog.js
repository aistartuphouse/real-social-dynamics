import { loadCatalog } from './config.js';

const isFullyApproved = (p) =>
  p.publicationState === 'approved' && p.identityStatus !== 'unresolved' && p.curriculumStatus === 'verified' &&
  p.rightsStatus === 'approved' && p.copyApproved && p.mediaApproved && p.fulfillmentReady && p.editionId;

// Brief §4.4/§12: HOLD/unverified items never reach public pages. Staging previews launch candidates
// (clearly flagged); production shows only fully approved, deliverable records.
export function publicPrograms(cfg, catalog = loadCatalog()) {
  return catalog.programs.filter((p) => {
    if (p.publicationState === 'hold' || !p.includedInLaunch) return false;
    return cfg.isStaging ? p.publicationState === 'candidate' || isFullyApproved(p) : isFullyApproved(p);
  });
}

export const findPublicProgram = (cfg, slug) => publicPrograms(cfg).find((p) => p.slug === slug) || null;

export function stats(programs) {
  const instructors = new Set(programs.map((p) => p.instructorKey).filter((k) => !['multi', 'various', 'unresolved'].includes(k)));
  return { programCount: programs.length, instructorCount: instructors.size };
}

export const julienSequence = (programs) =>
  programs.filter((p) => p.collection === 'julien-prequel').sort((a, b) => a.featuredOrder - b.featuredOrder);

export { isFullyApproved };
