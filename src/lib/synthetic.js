// Synthetic QA data only (brief §12). Never import production contacts here.
export const SYNTHETIC_USERS = [
  { id: 'usr_tm', email: 'tm.owner@example.test', firstName: 'Avery', priorEntitlements: ['transformation-mastery'], priorOtherTitles: [], synthetic: true },
  { id: 'usr_pimp', email: 'pimp.owner@example.test', firstName: 'Jordan', priorEntitlements: ['pimp', 'shift'], priorOtherTitles: [], synthetic: true },
  { id: 'usr_case', email: 'support.case@example.test', firstName: 'Riley', priorEntitlements: ['transformation-mastery'], priorOtherTitles: [], synthetic: true },
];

// Segments per brief §8.2. permission: 'verified' | 'unknown' | 'withdrawn'.
export const SYNTHETIC_CONTACTS = [
  { email: 'tm.owner@example.test', segment: 'A', permission: 'verified', engaged: true },
  { email: 'academy@example.test', segment: 'B', permission: 'verified', engaged: false },
  { email: 'highvibe@example.test', segment: 'C', permission: 'verified', engaged: true },
  { email: 'purpose@example.test', segment: 'D', permission: 'verified', engaged: false },
  { email: 'pimp.owner@example.test', segment: 'E', permission: 'verified', engaged: true },
  { email: 'bundle2025@example.test', segment: 'F', permission: 'verified', engaged: true },
  { email: 'support.case@example.test', segment: 'A', permission: 'verified', engaged: true },
  { email: 'chargeback@example.test', segment: 'G', permission: 'verified', engaged: false },
  { email: 'dormant@example.test', segment: 'I', permission: 'verified', engaged: false },
  { email: 'unknown.permission@example.test', segment: 'A', permission: 'unknown', engaged: true },
  { email: 'unsubscribed@example.test', segment: 'A', permission: 'verified', engaged: true },
];

export function seedSynthetic(store) {
  store.data.users.push(...SYNTHETIC_USERS.map((u) => ({ ...u })));
  store.data.contacts.push(...SYNTHETIC_CONTACTS.map((c) => ({ ...c })));
  store.data.supportCases.push({ id: 'case_seed', email: 'support.case@example.test', topic: 'access', message: 'Cannot log in to Transformation Mastery (synthetic).', status: 'open', openedAt: '2026-09-28T17:00:00Z' });
  store.data.suppression.push({ email: 'unsubscribed@example.test', reason: 'unsubscribe', at: '2026-01-02T00:00:00Z' });
  store.save();
}

// Sample merge values for previews. Obviously fake; dispatch refuses any unresolved tag.
export const SAMPLE_MERGE = {
  siteUrl: 'http://127.0.0.1:8130', firstNameOrThere: 'Avery', launchEndLocal: '[launch end, Pacific time]',
  approvedCallTermsShort: '[Approved call terms: duration, booking window, completion window]',
  approvedBriefingTermsShort: '[Approved briefing terms: date, format, hosts]',
  approvedPostLaunchChange: '[what changes after the deadline, as approved]',
  actualSenderLegalName: '[Sender legal name]', currentValidPostalAddress: '[Valid postal address]',
  verifiedSubscriptionExplanation: '[you purchased an RSD program and did not opt out]',
  preferencesURL: '#preferences', unsubscribeURL: '#unsubscribe', supportURL: '#support',
  packageName: 'The RSD Legacy Archive: The Prequel Collection', orderNumber: 'ord_sample',
  purchasedManifestSummary: '[exact programs and editions]', secureLibraryURL: '#library', secureBookingURL: '#booking',
  secureInvitationURL: '#invitation', approvedCallTerms: '[Approved call terms]', approvedBriefingTerms: '[Approved briefing terms]',
  receiptURL: '#receipt', supportContact: 'Real Social Dynamics Support: 310-202-9002 · support@realsocialdynamics.com', optionalProgramsDisclosure: '[optional paid programs disclosure]',
  briefingDateAndTime: '[briefing date and time]', briefingFormat: '[briefing format]', confirmedHosts: '[confirmed hosts]',
  briefingDeliveryCommitment: '[briefing delivery commitment]',
};
